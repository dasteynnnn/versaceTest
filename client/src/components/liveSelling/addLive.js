import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

function AddLive(){
    const [date, setDate] = useState('')
    const submitData = (date) => {
        if(date != ''){
            let details = {
                'date': date,
                'income': '0',
                'profit': '0',
                'settled': 'NO'
            }
            //handle api server settings
            let origin = window.location.origin;
            let host = origin.substring(7, origin.length - 5);
            let port = ':'+9000;
            //console.log(`host : ${host} | port : ${port}`)
            var formBody = [];
            for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody
            };
            fetch(`http://${host + port}/barbies/api/lives/add`, requestOptions)
                .then(async response => {
                    window.location.href = origin + '/lives';
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            console.log('Invalid Date')
        }
    }
    return (
        <Stack gap={2} className="col-md-6 mx-auto">
            <h1>New Live</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter date" onChange={data => setDate(data.target.value)} />
                </Form.Group>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <Button variant="primary" onClick={()=>{submitData(date)}}> Submit </Button>
                    <Button variant="danger" href='/lives'> Cancel </Button>
                </Stack>
                
            </Form>
        </Stack>
    )   
}

export default AddLive;