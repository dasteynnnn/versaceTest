import React, {useState, useEffect} from "react";

import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'

function Home() {
    //handle api server settings
    const origin = window.location.origin;
    const host = origin.substring(7, origin.length - 5);
    const port = ':'+9000;
    //console.log(`host : ${host} | port : ${port}`)    
    //handle table API data
    const [apiData, setApiData] = useState([])
    const week = 0;
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/getTasks/nov`)
            .then(res => { return res.json() })
            .then(res => {
                let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
                let result = [];
                for(let i = 0; i<res.result.weeks.length; i++){
                    for(let x = 0; x < res.result.weeks[i].length; x++){
                        result.push({
                            "month": month[res.result.weeks[i][x].monthIndex],
                            "week": i,
                            "dayName": days[x],
                            "day": res.result.weeks[i][x].day,
                            "project": res.result.weeks[i][x].project,
                            "sprint": res.result.weeks[i][x].sprint,
                            "tasks": res.result.weeks[i][x].tasks,
                            "blocker": res.result.weeks[i][x].blocker
                        })
                    }
                }
                setApiData(result)
            })
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //render table data
    const renderData = (data, index) => {
        return (
            <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>{data.month + " " + data.day}</td>
                <td>{data.dayName}</td>
                {/* <td>{"W" + (data.week + 1)}</td> */}
                <td>{data.project}</td>
                <td>{data.sprint}</td>
                <td>{data.tasks}</td>
                <td>{data.blocker}</td>
            </tr>
        )
    }
    return(
        <Stack gap={2} className="col-md-6 mx-auto">
            <h1>Task Monitoring</h1>
            {/* <h1>Lottery Result for tomorrow prediction</h1>
            <strong>
                <h3></h3>
            </strong>
            <h1>Lottery Result for tomorrow prediction</h1> */}
            <Table checkboxSelection bordered hover responsive>
                <thead>
                    <tr>
                        <th></th>
                        <th>Date</th>
                        <th>Day</th>
                        {/* <th>Week</th> */}
                        <th>Project</th>
                        <th>Sprint</th>
                        <th>Tasks</th>
                        <th>Blocker</th>
                    </tr>
                </thead>
                <tbody>
                    {apiData.map(renderData)}
                </tbody>
            </Table>
        </Stack>
    )
}

export default Home;