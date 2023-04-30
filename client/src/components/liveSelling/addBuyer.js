import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Stack,Form,Button} from 'react-bootstrap';

function AddBuyer() {
    //hande query parameters
    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const query = useQuery();
    //handle form values
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [mos, setMos] = useState('SHOPEE')
    const [mop, setMop] = useState('COD')
    const submitData = (liveId,firstName, lastName, mos, mop) => {
        if(firstName != '' && lastName != ''){
            let details = {
                liveId: liveId,
                firstName: firstName,
                lastName: lastName,
                mos: mos,
                mop: mop,
                dop: 'N/A',
                total: 0,
                profit: 0
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
            fetch(`http://${host + port}/barbies/api/lives/buyers/add`, requestOptions)
                .then(async response => {
                    window.location.href = origin + '/lives/view/?id='+query.get("id");
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            console.log('Invalid Input')
        }
    }
    return (
        <Stack gap={1} className="col-md-6 mx-auto">
            <h1>Add buyer</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" onChange={data => setFirstName(data.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" onChange={data => setLastName(data.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mode of Shipment (MOS)</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => setMos(data.target.value)}>
                        <option value="SHOPEE">SHOPEE</option>
                        <option value="MEETUP">MEETUP</option>
                        <option value="LALAMOVE">LALAMOVE</option>
                        <option value="GRAB">GRAB</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mode of Payment (MOP)</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => setMop(data.target.value)}>
                        <option value="COD">COD</option>
                        <option value="GCASH">GCASH</option>
                        <option value="BANKTRANSFER">BANKTRANSFER</option>
                    </Form.Select>
                </Form.Group>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <Button variant="primary" onClick={()=>{submitData(query.get("id"),firstName,lastName,mos,mop)}}> Submit </Button>
                    <Button variant="danger" href={'/lives/view/?id='+query.get("id")}> Cancel </Button>
                </Stack>
            </Form>
        </Stack>
    )
}

export default AddBuyer;