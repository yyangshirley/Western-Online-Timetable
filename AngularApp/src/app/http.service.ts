import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TimeTable } from './timetableSchema';
import { courseCode } from './coursecode';
import { Search } from './search';
import { Result } from './result';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  selectedCourseCode : courseCode;
  courseCodes: courseCode[]; 

  selectedResult : Result;
  results: Result[];

  constructor(private http: HttpClient) { }

  rootURL=`${environment.API_URL}/timetable`;

  getTimetable(): Observable<TimeTable[]>{
    return this.http.get<TimeTable[]>(`${this.rootURL}/getTimetableSchema`);
  }

  getCourseInfo(_id:string): Observable<any>{
    return this.http.get<TimeTable[]>(`${this.rootURL}/getSchedule/${_id}`);
  }
  
  getCourseCode(_id:string):Observable<courseCode[]>{
    return this.http.get<courseCode[]>(`${this.rootURL}/getCourseCode` + `/${_id}`);
  }

  search(body):Observable<any>{
    const config = { headers: new HttpHeaders().set('Content-Type','application/json') }
    return this.http.post<any>(`${this.rootURL}/getScheduleByAll`,body,config)
  }

  addSearchInfo(searchInfo){
    let mulsearchInfo = [];
    if(localStorage.getItem('Courses')){
      mulsearchInfo = JSON.parse(localStorage.getItem('Courses'));
      mulsearchInfo = [searchInfo, ...mulsearchInfo];
    }else{
      mulsearchInfo = [searchInfo];
    } 
    localStorage.setItem('Courses',JSON.stringify(mulsearchInfo));
  }
}