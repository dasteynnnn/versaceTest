import React, {useState, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {Stack,Button,Table,Modal} from 'react-bootstrap'

function View(){
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
    //handle live API data
    const [apiData, setApiData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lives/get/${query.get("id")}`)
            .then(res => { return res.json() })
            .then(res => setApiData(res.data))
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //handle Buyers table API data
    const [buyersData, setBuyersData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lives/buyers/get/${query.get("id")}`)
            .then(res => { return res.json() })
            .then(res => res.data == null ? setBuyersData([]) : setBuyersData(res.data))
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //handle modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //render Buyers table data
    const renderBuyersData = (data, index) => {
        return (
            <tr key={index}>
                <td>{data.firstName + ' ' + data.lastName}</td>
                <td>{data.mos}</td>
                <td>{data.mop}</td>
                <td>{data.dop}</td>
                <td>{data.total}</td>
                <td>
                    <div className="d-grid gap-2">
                        <Button variant='primary' className="btn btn-sm btn-block" href={'/lives/view/buyer/manage/?id='+data._id}>Manage</Button>
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id); setBuyerTotal(data.total); setProfitFromBuyer(data.profit)}}>Delete</Button>
                    </div>
                </td>
            </tr>
        )
    }
    //handle delete buyer API
    const [idToDelete, setIdToDelete] = useState('')
    const [buyerTotal, setBuyerTotal] = useState(0)
    const [profitFromBuyer, setProfitFromBuyer] = useState(0)
    const deleteBuyer = () => {
        if(idToDelete){
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            };
            fetch(`http://${host + port}/barbies/api/lives/buyers/delete/?id=${idToDelete}&total=${buyerTotal}&profit=${profitFromBuyer}&liveId=${query.get("id")}`, requestOptions)
                .then(res => { handleClose(); console.log(`Succesfully deleted live : ${idToDelete}`)})
                .catch(err => {
                    console.log(err)
                })
        }
    }
    //handle Sellers Earnings table API data
    const [sellersEarningsData, setSellersEarningsData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lives/sellers/earnings/?liveId=${query.get("id")}`)
            .then(res => { return res.json() })
            .then(res => res.data == null ? setSellersEarningsData([]) : setSellersEarningsData(res.data))
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //render Sellers Earnings table data
    const renderSellersEarningsData = (data, index) => {
        return (
            <tr key={index}>
                <td>{data._id}</td>
                <td>{data.income}</td>
                <td>{data.profit}</td>
                <td>{data.commission}</td>
                <td>{data.soldItems + ' items'}</td>
            </tr>
        )
    }
    return (
        <Stack gap={2} className="col-md-6 mx-auto">
            <Stack direction="horizontal" gap={3}>
                <Button className='btn btn-sm' variant="secondary" href={'/lives'}>Back</Button>
                <h1>Manage Live</h1>
            </Stack>
            <Stack gap={0}>
                <h5>General Information</h5>
                <span>
                    <strong>Date :</strong> {apiData.date}
                </span>
                <span>
                    <strong>Overall Income :</strong> {apiData.income}
                </span>
                <span>
                    <strong>Overall Profit :</strong> {apiData.profit}
                </span>
                <span>
                    <strong>Settled :</strong> {apiData.settled}
                </span>                                                                                                                                                                                                            
            </Stack>
            <br></br>
            <h5>Buyers Information</h5>
            <div className='col-md-3'><Button className='btn btn-success btn-sm' href={'/lives/view/buyer/add/?id='+query.get("id")}>Add Buyer</Button></div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>MOS</th>
                        <th>MOP</th>
                        <th>DOP</th>    
                        <th>Total</th>    
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {buyersData.map(renderBuyersData)}
                </tbody>
            </Table>
            <h5>Owners Earnings</h5>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Seller</th>
                        <th>Income</th>
                        <th>Profit</th>
                        <th>Commission</th>
                        <th>Sold Items</th>   
                    </tr>
                </thead>
                <tbody>
                    {sellersEarningsData.map(renderSellersEarningsData)}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Live</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this buyer and its purchases?</Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={deleteBuyer}>
                    Yes
                </Button>
                <Button variant="danger" onClick={handleClose}>
                    No
                </Button>
                </Modal.Footer>
            </Modal>
        </Stack>
    ) 
}

export default View;