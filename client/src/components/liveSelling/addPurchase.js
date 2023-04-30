import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Stack,Form,Button} from 'react-bootstrap';

function AddPurchase(){
    //handle api server settings
    const origin = window.location.origin;
    const host = origin.substring(7, origin.length - 5);
    const port = ':'+9000;
    //console.log(`host : ${host} | port : ${port}`)
    //hande query parameters
    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const query = useQuery();
    //handle form values
    const [code, setCode] = useState('')
    const [capital, setCapital] = useState(0)
    const [retail, setRetail] = useState(0)
    const [discount, setDiscount] = useState('None')
    const [profit, setProfit] = useState(0)
    const [owner, setOwner] = useState('Mariel')
    const [commission, setCommission] = useState(0)
    const submitData = (buyerId, liveId, code, capital, retail, discount, profit, owner, commission) => {
        if(discount !== 'None'){
            const discountValue = ((discount / 100) * retail)
            retail = retail - discountValue;
            profit = (retail - capital) + commission
        }
        if(buyerId !== '' && liveId !== '' && code !== '' && capital !== '' && retail !== '' && owner !== '' && commission !== ''){
            let details = {
                code: code,
                capital: capital,
                retail: retail,
                discount: discount,
                profit: profit,
                owner: owner,
                commission: commission,
                liveId: liveId,
                buyerId: buyerId
            }
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
            fetch(`http://${host + port}/barbies/api/lives/buyers/purchases/add`, requestOptions)
                .then(async response => {
                    window.location.href = origin + '/lives/view/buyer/manage/?id='+query.get("id");
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }else{
            console.log('Invalid Input')
        }
    }
    return(
        <Stack gap={1} className="col-md-6 mx-auto">
            <h1>Add Purchase</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Code" onChange={data => setCode(data.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Capital</Form.Label>
                    <Form.Control type="number" placeholder="Enter Capital" value={capital} onChange={data => {
                        setCapital(data.target.value)
                        setProfit((parseInt(retail) - parseInt(data.target.value)))
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Retail</Form.Label>
                    <Form.Control type="number" placeholder="Enter Retail" value={retail} onChange={data => {
                        setRetail(data.target.value)
                        setProfit((parseInt(data.target.value) - parseInt(capital)))
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Discount</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => { setDiscount(data.target.value) }}>
                        <option value="None">None</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="30">30%</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Profit</Form.Label>
                    <Form.Control type="disabled" placeholder="Profit" value={profit} onChange={data => setProfit(data.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Owner</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => setOwner(data.target.value)}>
                        <option value="Mariel">Mariel</option>
                        <option value="Elsie">Elsie</option>
                        <option value="Abby">Abby</option>
                        <option value="Daday">Daday</option>
                        <option value="Tatchen">Tatchen</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Commision</Form.Label>
                    <Form.Control type="disabled" placeholder="Commission" value={commission} onChange={data => setCommission(data.target.value)}/>
                </Form.Group>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <Button variant="primary" onClick={()=>{submitData(query.get("id"), query.get("live"),code,capital,retail,discount,profit,owner,commission)}}> Submit </Button>
                    <Button variant="danger" href={'/lives/view/buyer/manage/?id='+query.get("id")}> Cancel </Button>
                </Stack>
            </Form>
        </Stack>
    )
}

export default AddPurchase;