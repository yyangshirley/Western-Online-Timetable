const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const fs = require("fs");
require('dotenv/config');
app.use(bodyParser.json());
app.use(cors())


const timeTableJson = JSON.parse(fs.readFileSync('./json/fullTimetable.json'));
const timeTableInfoJson = JSON.parse(fs.readFileSync('./json/timetableInfo.json'));

app.get('/timetable/getTimetableSchema', (req, res) => {
    try {
        res.json({ timeTableInfoJson });
    } catch (err) {
        res.json({ message: err });
    }
});

app.get('/timetable/getCourseCode/:subject_id', function (req, res) {
    let course = timeTableJson.filter(course => course.subject === req.params.subject_id)
        .map(({ catalog_nbr, className }) => ({
            course_code_id: catalog_nbr,
            description: className
        }));
    
    if (course.length > 0) {
        res.json({ course_codes: course });
    } else {
        res.json({
            status: 400,
            response: 'Bad Request',
            message: `The subject ${req.params.subject_id} is unavailable`
        });
    }
})

app.post('/timetable/getSchedule', (req, res) => {
    let defSubjects = []
    ,defCampus = []
    ,defComponent = [];
  
    for (let i = 1; i < timeTableInfoJson.subject.length; i++) {
        defSubjects.push(timeTableInfoJson.subject[i].subject_id);
    }
    for (let j = 1; j < timeTableInfoJson.Campus.length; j++) {
        defCampus.push(timeTableInfoJson.Campus[j].Campus_value.replace("'", ""));
    }
    for (let k = 1; k < timeTableInfoJson.Component.length; k++) {
        defComponent.push(timeTableInfoJson.Component[k].Component_id);
    }

    const defaults = {
        subject: defSubjects,
        start_time: timeTableInfoJson.start_time,
        end_time: timeTableInfoJson.end_time,
        campus: defCampus,
        days: timeTableInfoJson.day,
        // delivery_type: "LEC";
        component: defComponent,
        enrl_stat: "Not full"
    }

    let filters = Object.assign({}, defaults, req.body);
    let checker = (arr, target) => target.some(v => arr.includes(v));

    let subjectsResp = timeTableJson.filter(obj => checker(obj.course_info[0].days, filters.days)
        &&
        filters.subject.includes(obj.subject) &&
        filters.start_time.includes(obj.course_info[0].start_time.toLowerCase()) &&
        filters.end_time.includes(obj.course_info[0].end_time.toLowerCase()) &&
        filters.campus.includes(obj.course_info[0].campus) &&
        filters.component.includes(obj.course_info[0].ssr_component) &&
        filters.enrl_stat.includes(obj.course_info[0].enrl_stat)
    )

    try {
        res.json({ length: subjectsResp.length,
                    result: subjectsResp });
    } catch (err) {
        res.json({ message: err });
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(req.body);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;
