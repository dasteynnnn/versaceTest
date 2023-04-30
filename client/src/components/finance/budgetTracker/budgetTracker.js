import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

function Home() {
    const [salary15th, setSalary15th] = useState('')
    const [expenses15th, setExpenses15th] = useState('')
    const [savings15th, setSavings15th] = useState('0')
    const [remaining15th, setRemaining15th] = useState('')
    const [totalRemaining15th, settotalRemaining15th] = useState('')

    const [salary30th, setSalary30th] = useState('')
    const [expenses30th, setExpenses30th] = useState('')
    const [savings30th, setSavings30th] = useState('')
    const [remaining30th, setRemaining30th] = useState('')
    const [totalRemaining30th, settotalRemaining30th] = useState('')

    const [monthlySalary, setMonthlySalary] = useState('')
    const [monthlyTakeHome, setMonthlyTakeHome] = useState('')
    const [monthlyExpenses, setMonthlyExpenses] = useState('')
    const [monthlyLoanExpense, setMonthlyLoanExpense] = useState('')
    const [estimatedMonthCompletion, setEstimatedMonthCompletion] = useState('')
    const [remainingLoan, setRemainingLoan] = useState('')

    const [filterFrequency, setFilterFrequency] = useState('all')
    const [filterIsLoan, setFilterIsLoan] = useState('all')

    //handle api server settings
    const origin = window.location.origin;
    const host = origin.substring(7, origin.length - 5);
    const port = ':'+9000;
    //console.log(`host : ${host} | port : ${port}`)
    //handle table API data
    const [apiData, setApiData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/expenses/get`)
            .then(res => { return res.json() })
            .then(res => {
                var getExpenses15th = 0;
                var getExpenses30th = 0;
                var getLoanRemaining = 0;
                var getMonthlyLoanExpense = 0;
                for(let i = 0; i < res.data.length; i++){
                    if(res.data[i].frequency == "15") getExpenses15th += res.data[i].amount
                    if(res.data[i].frequency == "30") getExpenses30th += res.data[i].amount
                    if(res.data[i].frequency == "2") {
                        getExpenses15th += res.data[i].amount
                        getExpenses30th += res.data[i].amount
                    }
                    if(res.data[i].isLoan == "YES") {
                        let unpaid = res.data[i].term - res.data[i].doneTerm
                        if(res.data[i].frequency == "15" || res.data[i].frequency == "30"){
                            getLoanRemaining += (res.data[i].amount * unpaid)
                            getMonthlyLoanExpense += res.data[i].amount
                        }
                        if(res.data[i].frequency == "2"){
                            getLoanRemaining += (res.data[i].amount * ((res.data[i].term * 2) - unpaid))
                            getMonthlyLoanExpense += (res.data[i].amount * 2)
                        }
                    }
                }

                setExpenses15th(getExpenses15th)
                setExpenses30th(getExpenses30th)
                //setMonthlyTakeHome(monthlySalary - (getExpenses15th + getExpenses30th))
                setMonthlyExpenses(getExpenses15th + getExpenses30th)
                setRemainingLoan(getLoanRemaining)
                setMonthlyLoanExpense(getMonthlyLoanExpense)
                setEstimatedMonthCompletion((getLoanRemaining / getMonthlyLoanExpense).toFixed(2))

                let sortedApiData = res.data.sort((a,b) => {
                    if(a.amount > b.amount){
                        return -1
                    }
                })

                setApiData(sortedApiData) 
                //setResult(cc(balance, 0))
            })
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //handle modal
    const [showPay, setShowPay] = useState(false);
    const handleClosePay = () => setShowPay(false);
    const handleShowPay = () => setShowPay(true);
    //handle pay loan API
    const [idToPay, setIdToPay] = useState('')
    const [doneTerm, setDoneTerm] = useState('')
    const payLoan = () => {
        if(idToPay){
            let details = {
                'doneTerm': doneTerm
            }
            var formBody = [];
            for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody
            };
            fetch(`http://${host + port}/barbies/api/expenses/loan/pay/${idToPay}`, requestOptions)
                .then(res => { handleClosePay(); console.log(`Succesfully Payed Loan : ${idToPay}`)})
                .catch(err => {
                    console.log(err)
                })
        }
    }
    //handle delete live API
    const [idToDelete, setIdToDelete] = useState('')
    const deleteLive = () => {
        if(idToDelete){
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            };
            fetch(`http://${host + port}/barbies/api/expenses/delete/${idToDelete}`, requestOptions)
                .then(res => { handleClose(); console.log(`Succesfully deleted expense : ${idToDelete}`)})
                .catch(err => {
                    console.log(err)
                })
        }
    }
    //handle modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //render table data
    const renderData = (data, index) => {
        let loanRow = (
            <tr key={index}>
                <td>{data.name}</td>
                <td>{(data.amount).toLocaleString('en-PH', { 
                        style: 'currency', 
                        currency: 'PHP' 
                    })}</td>
                <td>
                    <div className="d-grid gap-2">
                        <small>is Loan? : {data.isLoan}</small> 
                        <small>Loan Start Date? : {data.loanStartDate}</small> 
                        <small>Term : {data.term + " Months"}</small> 
                        <small>Frequency : {data.frequency == 2 ? "every 15th & 30th" : data.frequency == 15 ? "every 15th" : "every 30th"}</small> 
                        <small>Completed : {data.frequency == 2 ? data.doneTerm + "/" + (data.term * 2) : data.doneTerm + "/" + data.term}</small> 
                    </div>
                </td>
                <td>
                    <div className="d-grid gap-2">
                        <Button type='submit' variant='success' className="btn btn-sm btn-block" onClick={()=>{handleShowPay(); setIdToPay(data._id); setDoneTerm(parseInt(data.doneTerm + 1))}}>Pay Loan</Button>
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id)}}>Delete</Button>
                        {/* <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>deleteLive(data._id)}>Delete</Button> */}
                    </div>
                </td>
            </tr>
        )
        let regularRow =  (
            <tr key={index}>
                <td>{data.name}</td>
                <td>{(data.amount).toLocaleString('en-PH', { 
                        style: 'currency', 
                        currency: 'PHP' 
                    })}</td>
                <td>
                    <div className="d-grid gap-2">
                        <small>Frequency : {data.frequency == 2 ? "every 15th & 30th" : data.frequency == 15 ? "every 15th" : "every 30th"}</small> 
                    </div>
                </td>
                <td>
                    <div className="d-grid gap-2">
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id)}}>Delete</Button>
                        {/* <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>deleteLive(data._id)}>Delete</Button> */}
                    </div>
                </td>
            </tr>
        )
        if(filterFrequency == "all" && filterIsLoan == "all"){
            if(data.isLoan == "YES"){
                return loanRow
            } else {
                return regularRow
            }
        } else if(filterFrequency != "all" && filterIsLoan == "all"){
            if(filterFrequency != 2){
                if(filterFrequency == data.frequency || data.frequency == 2){
                    if(data.isLoan == "YES"){
                        return loanRow
                    } else {
                        return regularRow
                    }
                }
            } else {
                if(filterFrequency == data.frequency){
                    if(data.isLoan == "YES"){
                        return loanRow
                    } else {
                        return regularRow
                    }
                }
            }
        } else if(filterFrequency == "all" && filterIsLoan != "all"){
            if(filterIsLoan == data.isLoan){
                if(data.isLoan == "YES"){
                    return loanRow
                } else {
                    return regularRow
                }
            }
        } else {
            if(filterFrequency != 2){
                if(filterIsLoan == data.isLoan && filterFrequency == data.frequency || data.frequency == 2){
                    if(data.isLoan == "YES"){
                        return loanRow
                    } else {
                        return regularRow
                    }
                }
            } else {
                if(filterIsLoan == data.isLoan && filterFrequency == data.frequency){
                    if(data.isLoan == "YES"){
                        return loanRow
                    } else {
                        return regularRow
                    }
                }
            }
        }
    }

    return(
        <Stack gap={3} className="col-md-6 mx-auto">
            {/* <h1>Budget Tracker</h1> */}
            <br></br>
            <center>
                <p style={{'font-size':'50px'}}>Salary Flow</p>
            </center>
            <p style={{'font-size':'30px'}}><strong>15th</strong> of the Month</p>
            <Form.Group className="mb-3">
                <Stack direction="horizontal" gap={4}>
                    <Stack gap={3}>
                        <Form.Label>Expected Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter Expected 15th Salary" onChange={(data) => {
                            setSalary15th(data.target.value)
                            let iniRemaining15th = (parseInt(data.target.value) - parseInt(expenses15th))
                            settotalRemaining15th(iniRemaining15th)
                            if(iniRemaining15th > 2500){
                                setSavings15th((parseInt(iniRemaining15th) - 2500))
                                setRemaining15th(2500)
                            } else {
                                setSavings15th(0)
                                setRemaining15th(iniRemaining15th)
                            }
                            setMonthlySalary((parseInt(data.target.value) + parseInt(salary30th)))
                            setMonthlyTakeHome(((parseInt(data.target.value) + parseInt(salary30th)) - (parseInt(expenses15th) + parseInt(expenses30th))))
                        }} />
                    </Stack>
                    <div className="vr" />
                    <Stack gap={3}>
                        <span>
                            <br></br>
                            <strong>Total Expenses :</strong> {(expenses15th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Total Remaining :</strong> {(totalRemaining15th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Savings :</strong> {(savings15th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Allowance :</strong> {(remaining15th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                        </span>
                        
                    </Stack>
                </Stack>
            </Form.Group>
            <p style={{'font-size':'30px'}}><strong>30th</strong> of the Month</p>
            <Form.Group className="mb-3">
                <Stack direction="horizontal" gap={4}>
                    <Stack gap={3}>
                        <Form.Label>Expected Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter Expected 30th Salary" onChange={data => {
                            setSalary30th(data.target.value)
                            let iniRemaining30th = (parseInt(data.target.value) - parseInt(expenses30th))
                            settotalRemaining30th(iniRemaining30th)
                            if(iniRemaining30th > 2500){
                                setSavings30th((parseInt(iniRemaining30th) - 2500))
                                setRemaining30th(2500)
                            } else {
                                setSavings30th(0)
                                setRemaining30th(iniRemaining30th)
                            }
                            setMonthlySalary((parseInt(data.target.value) + parseInt(salary15th)))
                            setMonthlyTakeHome(((parseInt(data.target.value) + parseInt(salary15th)) - (parseInt(expenses15th) + parseInt(expenses30th))))
                        }} />
                    </Stack>
                    <div className="vr" />
                    <Stack gap={3}>
                        <span>
                            <br></br>
                            <strong>Total Expenses :</strong> {(expenses30th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Total Remaining :</strong> {(totalRemaining30th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Savings :</strong> {(savings30th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                            <br></br>
                            <strong>Allowance :</strong> {(remaining30th).toLocaleString('en-PH', { 
                                style: 'currency', 
                                currency: 'PHP' 
                            })}
                        </span>
                    </Stack>
                </Stack>

                <br></br>

                <p style={{'font-size':'30px'}}><strong>Monthly</strong> Summary</p>
                <Stack gap={2}>
                    <span>
                        <strong>Monthly Salary :</strong> {(monthlySalary).toLocaleString('en-PH', { 
                            style: 'currency', 
                            currency: 'PHP' 
                        })}
                    </span>
                    <span>
                        <strong>Monthly Expenses :</strong> {(monthlyExpenses).toLocaleString('en-PH', { 
                            style: 'currency', 
                            currency: 'PHP' 
                        })}
                    </span>
                    <span>
                        <strong>Monthly Take-home :</strong> {(monthlyTakeHome).toLocaleString('en-PH', { 
                            style: 'currency', 
                            currency: 'PHP' 
                        })}
                    </span>
                </Stack>
            </Form.Group>

            <center>
                <p style={{'font-size':'50px'}}>Expenses</p>
            </center>
            <p style={{'font-size':'30px'}}><strong>Loans</strong> Summary</p>
            <Stack gap={2}>
                <span>
                    <strong>Total Loans Remaining :</strong> {(remainingLoan).toLocaleString('en-PH', { 
                            style: 'currency', 
                            currency: 'PHP' 
                        })}
                </span>
                <span>
                    <strong>Monthly Loans Expenses :</strong> {(monthlyLoanExpense).toLocaleString('en-PH', { 
                            style: 'currency', 
                            currency: 'PHP' 
                        })}
                </span>
                <span>
                    <strong>Estimated Months Remaining to Complete Loans :</strong> {estimatedMonthCompletion} <small> Months</small>
                </span>
            </Stack>
            
            <br></br>

            <center>
                <span>
                    <small>
                        <strong>Table Filters : </strong>
                    </small>
                </span>
            </center>
            
            <Stack direction="horizontal" gap={3}>
                <Stack gap={2}>
                    <Form.Group>
                        <Form.Label>Frequency</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={data => { 
                            setFilterFrequency(data.target.value)
                        }}>
                            <option value="all">Show all</option>
                            <option value="15">every 15th</option>
                            <option value="30">every 30th</option>
                            <option value="2">every 15th & 30th</option>
                        </Form.Select>
                    </Form.Group>
                </Stack>
                <div className="vr" />
                <Stack gap={2}>
                    <Form.Group>
                        <Form.Label>is Loan?</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={data => { 
                            setFilterIsLoan(data.target.value)
                        }}>
                            <option value="all">Show all</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </Form.Select>
                    </Form.Group>
                </Stack>
            </Stack>
            
            <br></br>

            <div className='col-md-3'><Button className='btn btn-primary btn-sm' href='/budget/add'>Add New Expense</Button></div>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Details</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {apiData.map(renderData)}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this expense?</Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={deleteLive}>
                    Yes
                </Button>
                <Button variant="danger" onClick={handleClose}>
                    No
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPay} onHide={handleClosePay}>
                <Modal.Header closeButton>
                <Modal.Title>Pay Loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to pay this loan?</Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={payLoan}>
                    Yes
                </Button>
                <Button variant="danger" onClick={handleClosePay}>
                    No
                </Button>
                </Modal.Footer>
            </Modal>
        </Stack>
    )
}

export default Home;