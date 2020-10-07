export interface Result{
    length:Number,
    result:[{
        catalog_nbr:string,
        subject:string,
        className:string,
        course_info:[{
            class_nbr:string,
            start_time:string,
            descrlong:string,
            end_time: string,
            campus: string,
            facility_ID: string,
            days: [],
            instructors: [],
            class_section: string,
            ssr_component: string
            enrl_stat: string,
            descr:string 
        }],
        catalog_description:string
    }]
}