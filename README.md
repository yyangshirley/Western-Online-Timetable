# Western-Online-Timetable
Online timetable web application for Western University.

## Introduction
The purpose of the project is to provide a web application which is user friendly to Western students, faculties and staffs. This application is designed for searching for courses scheduled for the semester by filtering course conditions like (the campus the course is offered or the starting time and the ending time the course is offered). 

Mainly, the application has two modules: searching module and result module. Searching module provides 7 filter conditions for users to select to obtain detailed course information. In addition, the result module will display all search results and also the number of results.

The user can select the filter criteria through the drop-down boxes and also check or uncheck day of class to narrow the scope of the course. Then they can click the “submit” button to fetch the course information from the json files provided by western ITS. As a result, users can arrange their course schedule for the next semester by obtaining the course description they want.

Since the input of our application is obtained through checkboxes and drop-down boxes there will not be 400 error or called “Bad Request” when the input information is empty.

## Application Design
### Back-end Design
First of all, the data we used in this project came from the json file provided by WTS team, namely fullTimetable.json and timetableInfo.json. 

To meet the requirements of assigning values to the drop-down boxes on the front end and getting required course information from json files by setting specified parameters, we designed these following three APIs :

#### 1. API: /timetable/getTimetableSchema
This API is used to get all fields such as subject names, course names, components etc. from timetableInfo.json and return an array of these fields so that these values can be set on the drop-down boxes automatically rather than manually entering these tedious data. It will return the following array:

- Component array: the type of courses. 
-	Campus array: the campus where the course is offered.
-	CourseType array: the delivery type of courses.
-	Designation array: the courses offered within the term(i.e. Fall session, winter session or fall/winter session) or certain types of course (i.e. essay, non-essay).
-	Subject array: the subjects.
-	Day array: day of class (Monday - Friday).
-	Start time array: the starting time of classes (8:00 am-7:00 pm).
-	End time array: the ending time of classes (9:00 am – 10:00 pm).


#### 2. API: /timetable/getCourseCode/:subject_id
This API is designed for getting course codes of all subjects by subject id. For example, GET /timetable/getCourseCode/ACTURSCI returns all subjects in “ACTURSCI”. The return array will be shown in the following format.
-	Course_code_id: the course number mapping course code with its subject id.
-	Description: the course name of the course id.

#### 3. API: /timetable/getScheduleByAll
This is our main API for obtaining detailed course information by setting the parameters of body. The request body should be as shown in the following example:

As the course number will be entered manually, that input errors may occur, we set a fuzzy matching program in this API. The other parameters are rare to happen because the user will select the value configured by frontend.
The response parameters are shown below:
- Length: the number of related subjects searched.
- Results array: searched results parameters:
  - Catalog_nbr: course id
  -	Subject: subject id
  -	className: course name
  -	course_info array: the array of course information
    -	class_nbr: class number
    -	start_time: starting time of the course
    - descrlong: the prerequisites for the course
    -	end_time: ending time of the course
    -	campus: the campus where the course is offered.
    -	facility_ID: the location of course offered, which consist of the building name and room number.
    -	Days: the days of week offered by the course, which is displayed in array.
    -	Instructors: the name of the instructor tutoring the course.
    -	class_section: the section of the class
    -	ssr_component: component type for the course
    -	enrl_stat: entollment status (i.e. Full/Not Full)
    -	descr: restriction of the course
  -	catalog_description: description of the course

###	Front-end Design
In order to provide users with a good interface and based on the functional requirements, our web application requires one page to search courses and display understandable results. The whole front-end design is divided into the following parts.

- Create HTTP service

After configuring the basic setting, we create HTTP service to connect nodejs API. Similar to the backend API, we use GET and POST method to fetch data.

-	Search section

In this section, the main two tasks are to assign the timetable schema obtained by the backend to drop-down box, and to collect the value of the drop-down box into json format and transfer it to the backend to search course information.
The first task can be solved by ngModel, an instruction that can bind drop-down box and check box, and then display all the data got by using for loop.
The second task can use FormControl a reactive form to bind the selected value and then transfer as json format to backend server.

-	Result section

In this part, it was much simpler than the last. We also use ngModel to bind the data obtained from the backend and display in the table.
In order to make the interface look simpler, we use the pagination function, displaying only five pieces of results on the page.

-	Local storage configuration

Local Storage allows us to store data in user’s browser until it is cleared. We use setItem() and getItem() function to set and get value from HTML5 local storage.


### Application Setup
- Install dependencies

In our application, we will need express and body-parser modules. Use the below command in the command line to install these node modules under the main folder “western-timetable”.
```
$ npm install express body-parser –save
```
Then open package.json still in this folder to check whether it is as shown in the figure and move to the next step.

- Run the backend server

To start the backend server by running the following command still under the folder “western-timetable”. 
```
$ node  server.js
```
If everything goes well, in cmd you will see “server started at port:8080”, which means the server is running succussesfully.

- Start the angular server

Next, in order to start angular server, first enter into the folder named “AngularApp” where the angular application is located. Then use the command below to run the frontend server.
```
$ ng server -o
```
If compiled successfully, a web page will automatically pop up in your browser or you should manually enter http://localhost:4200 as URL in the search bar of the browser.
