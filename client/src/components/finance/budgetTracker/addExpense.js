import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

function AddLive(){
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [term, setTerm] = useState('')
    const [frequency, setFrequency] = useState('')
    const [isLoan, setIsLoan] = useState('NO')
    const [loanStartDate, setLoanStartDate] = useState('')
    const [repeat, setRepeat] = useState('NO')
    const submitData = (name, amount, term, frequency, isLoan, loanStartDate, repeat) => {
        if(name != '' && amount != '' && term != '' && frequency != ''){
            let details = {
                'name': name,
                'amount': amount,
                'term': term,
                'frequency': frequency,
                'isLoan': isLoan,
                'loanStartDate': loanStartDate,
                'repeat': repeat,
                'doneTerm': 0
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
            fetch(`http://${host + port}/barbies/api/expenses/add`, requestOptions)
                .then(async response => {
                    window.location.href = origin + '/budget/tracker';
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            console.log('Invalid Input')
        }
    }
    return (
        <Stack gap={2} className="col-md-6 mx-auto">
            <h1>New Expense</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" onChange={data => setName(data.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="text" placeholder="Enter Amount" onChange={data => setAmount(data.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Term</Form.Label>
                    <span>
                        <br></br>
                        <small>*Term refers to the number of months you need to settle this expense</small>
                        <br></br>
                        <small>*Term value will be disregarded when Repeat is set to "YES"</small>
                    </span>
                    <Form.Control type="number" placeholder="Enter Term" onChange={data => setTerm(data.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Frequency</Form.Label>
                    <span>
                        <br></br>
                        <small>*Frequency refers to the number of cutoffs per month you need to settle this expense</small>
                        <br></br>
                        <small>*Use values (15, 30, 2), use 15 or 30 if you only need to settle this once every 15th or 30th of the month respectively. use 2 if both</small>
                    </span>
                    <Form.Control type="number" placeholder="Enter Frequency" onChange={data => setFrequency(data.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Loan?</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => setIsLoan(data.target.value)}>
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Loan Start Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter date" onChange={data => setLoanStartDate(data.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Repeat?</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => setRepeat(data.target.value)}>
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </Form.Select>
                </Form.Group>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <Button variant="primary" onClick={()=>{submitData(name, amount, term, frequency, isLoan, loanStartDate, repeat)}}> Submit </Button>
                    <Button variant="danger" href='/budget/tracker'> Cancel </Button>
                </Stack>
                
            </Form>
        </Stack>
    )   
}

export default AddLive;