import React, {useState, useEffect} from "react";

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Modal from 'react-bootstrap/Modal'

function Lives() {
    //handle api server settings
    const origin = window.location.origin;
    const host = origin.substring(7, origin.length - 5);
    const port = ':'+9000;
    //console.log(`host : ${host} | port : ${port}`)
    //handle table API data
    const [apiData, setApiData] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lives/get`)
            .then(res => { return res.json() })
            .then(res => {
                setApiData(res.data) 
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }, 800);
        return () => clearInterval(interval);
    }, []);
    //handle delete live API
    const [idToDelete, setIdToDelete] = useState('')
    const deleteLive = () => {
        if(idToDelete){
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            };
            fetch(`http://${host + port}/barbies/api/lives/delete/${idToDelete}`, requestOptions)
                .then(res => { handleClose(); console.log(`Succesfully deleted live : ${idToDelete}`)})
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
        return (
            <tr key={index}>
                <td>{data.date}</td>
                <td>{data.settled}</td>
                <td>
                    <div className="d-grid gap-2">
                        <Button variant='primary' className="btn btn-sm btn-block" href={'/lives/view/?id='+data._id}>Manage</Button>
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id)}}>Delete</Button>
                        {/* <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>deleteLive(data._id)}>Delete</Button> */}
                    </div>
                </td>
            </tr>
        )
    }
    return(
        <Stack gap={2} className="col-md-6 mx-auto">
            <h1>Lives list</h1>
            <div className='col-md-3'><Button className='btn btn-success btn-sm' href='/lives/add'>Add</Button></div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Settled</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {apiData.map(renderData)}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Live</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this live?</Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={deleteLive}>
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

export default Lives;