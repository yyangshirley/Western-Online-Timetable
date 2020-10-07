import { Component, OnInit,Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpService } from '../http.service';
import { TimeTable } from '../timetableSchema';
import { Result } from '../result';
import { Search } from '../search';
import { NgForm, FormControl,FormBuilder,Validators,FormGroup,FormArray } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { throwError } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public loading = true;

  subject:any[];
  component:any[];
  campus:any[];
  design:any[];
  start_time:any[];
  end_time:any[];
  status: string = "";

  day = [
    { value:"Mon", key:"M" },
    { value:"Tue", key:"Tu"},
    { value:"Wed", key:"W" },
    { value:"Thu", key:"Th" },
    { value:"Fri", key:"F" }
  ]
  daysArray=['M','Tu','W','Th','F'];
  courseInfoResult:Object;
  resultLength: Number;
  resultLengthStr: string;
  courseResult: any[];
  p:Number;
  className:string;
  public errorMsg: string;
  public successMsg: string;

  selectedCourse:string = '';
  searchForm: FormGroup;
  searchInfo:any = {};
  constructor(public _http:HttpService,
    public formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getTimetable();
    this.createSearchForm();
  }
 
  createSearchForm(){
  this.searchForm = this.formBuilder.group({
    subject: new FormControl('All Subjects', Validators.required),
    start_time: new FormControl('All', Validators.required),
    end_time: new FormControl('All', Validators.required),
    days: new FormControl(this.daysArray,Validators.required),
    campus: new FormControl('Any', Validators.required),
    //enrl_stat: new FormControl('Not Full', Validators.required), 
    component: new FormControl('All',Validators.required),
    course_number:new FormControl(''),
    status:new FormControl()
  });
  }



  getTimetable(){
      this._http.getTimetable().subscribe((timeTable:TimeTable[])=>{
      this.subject=timeTable['timeTableInfoJson']['subject'];
      this.campus=timeTable['timeTableInfoJson']['Campus'];
      this.component=timeTable['timeTableInfoJson']['Component'];
      this.design=timeTable['timeTableInfoJson']['Designation'];
      this.start_time=timeTable['timeTableInfoJson']['start_time'];
      this.end_time=timeTable['timeTableInfoJson']['end_time'];
      this.loading=false;
    },
    (error:ErrorEvent)=>{
      this.errorMsg = error.error.message;
      this.loading = false;
    })
  }

  getCourse(name:string, event:any){
    this.selectedCourse = `${event.target.value}`;
    console.log(this.selectedCourse);
  }

  getSelected(name:string, event:any){
    var string = `${event.target.value}`;
    console.log(`${name}:${string}`);
  }
  
  
  getDays(event: any){
    if(event.target.checked){
      this.daysArray.push((event.target.value));
    }
    else{
      this.daysArray=this.daysArray.filter(function(item){
        return item != event.target.value
      })
    }
    this.searchForm.patchValue({days:this.daysArray})
  }

  getStatus(event: any){
    if(event.target.checked){
      this.status = "Not full";
    }else{
      this.status = "";
    }
  }


  get f(){
    return this.searchForm.controls;
  }

  onSubmit(){
    document.getElementById("s1").style.display ="inline";
    document.getElementById("line").style.display ="block";
    if(this.searchForm.value.subject=="All Subjects"){
      this.searchForm.value.subject='';
    }
    if(this.searchForm.value.start_time=="All"){
      this.searchForm.value.start_time='';
    }
    if(this.searchForm.value.end_time=="All"){
      this.searchForm.value.end_time='';
    }
    if(this.searchForm.value.campus=="Any"){
      this.searchForm.value.campus='';
    }
    if(this.searchForm.value.component=="All"){
      this.searchForm.value.component='';
    } 
    this.searchForm.value.course_number = this.selectedCourse;
    this.searchForm.value.status = this.status;
    //console.log(this.searchForm.value.status);
    //console.log(this.searchForm.value);
    this.save();
    this.getAll();
    document.querySelector("#result").scrollIntoView();

  }

  save(){
    //console.log(this.searchForm.value);
    this.searchInfo = Object.assign(this.searchInfo,this.searchForm.value);
    //localStorage.setItem('Courses',JSON.stringify(this.searchInfo));
    this._http.addSearchInfo(this.searchInfo);
  }

  getAll(){
    const body=JSON.stringify(this.searchForm.value);
    //console.log(body);
    this._http.search(body).subscribe(res =>{
      this._http.results = res as Result[];
      this.courseInfoResult =this._http.results;
      this.courseResult = this.courseInfoResult['result'];
      this.resultLength =this.courseResult.length;
      this.resultLengthStr = this.resultLength + " Results";
    })
  }

  Search(){
    if(this.className!=""){
    this.courseResult = this.courseResult.filter(res =>{
      return res.className.toLocaleLowerCase().match(this.className.toLocaleLowerCase());
    });
    this.resultLength =this.courseResult.length;
    this.resultLengthStr = this.resultLength + " Results";
    }else if (this.className == ""){
       this.onSubmit();
    }
  }
}