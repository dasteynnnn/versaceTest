import React, {useState,useEffect} from "react";
import {useLocation} from "react-router-dom";
import {Stack,Button,Table,Modal} from 'react-bootstrap'


function Buyer(){
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
            fetch(`http://${host + port}/barbies/api/lives/buyers/get/single/${query.get("id")}`)
            .then(res => { return res.json() })
            .then(res => setApiData(res.data))
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
    //handle Purchases table API data
    const [purchasesData, setPurchasesData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lives/buyers/purchases/get/${query.get("id")}`)
            .then(res => { return res.json() })
            .then(res => res.data == null ? setPurchasesData([]) : setPurchasesData(res.data))
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //render Purchases table data
    const renderPurchasesData = (data, index) => {
        return (
            <tr key={index}>
                <td>{data.code}</td>
                <td>{data.capital}</td>
                <td>{data.retail}</td>
                <td>{data.discount == 'None' ? data.discount : data.discount + '%'}</td>
                <td>{data.profit}</td>
                <td>{data.owner}</td>
                <td>
                    <div className="d-grid gap-2">
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id); setRetail(data.retail); setProfit(data.profit); setCommission(data.commission)}}>Delete</Button>
                    </div>
                </td>
            </tr>
        )
    }
    //handle delete purchase API
    const [idToDelete, setIdToDelete] = useState('')
    const [retail, setRetail] = useState(0)
    const [profit, setProfit] = useState(0)
    const [commission, setCommission] = useState(0)
    const deletePurchase = () => {
        if(idToDelete){
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            };
            fetch(`http://${host + port}/barbies/api/lives/buyers/purchases/delete/?id=${idToDelete}&retail=${retail}&profit=${profit}&commission=${commission}&liveId=${apiData.liveId}&buyerId=${query.get("id")}`, requestOptions)
                .then(res => { handleClose(); console.log(`Succesfully deleted live : ${idToDelete}`)})
                .catch(err => {
                    console.log(err)
                })
        }
    }
    return(
        <Stack gap={2} className="col-md-6 mx-auto">
            <Stack direction="horizontal" gap={3}>
                <Button className='btn btn-sm' variant="secondary" href={'/lives/view/?id='+apiData.liveId}>Back</Button>
                <h1>Manage Buyer</h1>
            </Stack>
            <Stack gap={0}>
                <h5>Buyer Information</h5>
                <span>
                    <strong>Name :</strong> {apiData.firstName + ' ' + apiData.lastName}
                </span>
                <span>
                    <strong>Mode of Shipment :</strong> {apiData.mos}
                </span>
                <span>
                    <strong>Mode of Payment :</strong> {apiData.mop}
                </span>
                <span>
                    <strong>Date of Payment :</strong> {apiData.dop}
                </span>
                <span>
                    <strong>Total :</strong> {apiData.total}
                </span>
            </Stack>
            <br></br>
            <h5>Purchases</h5>
            <div className='col-md-3'><Button className='btn btn-success btn-sm' href={'/lives/view/buyer/purchases/add/?id='+query.get("id")+'&live='+apiData.liveId}>Add Puchase</Button></div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Capital</th>
                        <th>Retail</th>
                        <th>Discount</th>    
                        <th>Profit</th>    
                        <th>Owner</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchasesData.map(renderPurchasesData)}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Live</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this purchase?</Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={deletePurchase}>
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

export default Buyer;