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
    //handle winning number table API data
    const [winningNumberData, setWinningNumberData] = useState([])
    //handle posible winning number for most won number table data
    const [posibleWinningNumber, setPosibleWinningNumber] = useState([])
    //handle picked number table API data
    const [pickedNumberData, setPickedNumberData] = useState([])
    //handle posible winning number for most picked number table data
    const [posiblePickedNumber, setPosiblePickedNumber] = useState([])
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://${host + port}/barbies/api/lottery/get`)
            .then(res => { return res.json() })
            .then(res => {
                var winningNumbers = [];
                for(let i = 0; i < res.data.length; i++){
                    var result = res.data[i].result.split("-");
                    var win = res.data[i].winners > 0 ? 1 : 0
                    var date = res.data[i].date
                    var find = false
                    for(let x = 0; x < result.length; x++){
                        if(winningNumbers.length){
                            for(let y = 0; y < winningNumbers.length; y++){
                                if(winningNumbers[y].number == result[x]){
                                    find = true;
                                    if(winningNumbers[y].date == date){
                                        if(win == 1){
                                            if(!winningNumbers[y].increment){
                                                winningNumbers[y].wins += win
                                                winningNumbers[y].increment = true
                                            }
                                        } else {
                                            winningNumbers[y].increment = false
                                        }
                                    }else{
                                        winningNumbers[y].date = date
                                        if(win == 1){
                                            winningNumbers[y].wins += win
                                            winningNumbers[y].increment = true
                                        } else {
                                            winningNumbers[y].increment = false
                                        }
                                    }
                                    break
                                }
                            }
                            if(find == false){
                                winningNumbers.push({
                                    number : result[x],
                                    wins : win,
                                    date : date,
                                    increment : win == 0 ? false : true
                                })
                            } else {
                                find = false
                            }
                        } else {
                            winningNumbers.push({
                                number : result[x],
                                wins : win,
                                date : date,
                                increment : win == 0 ? false : true
                            })
                        }
                    }
                }
                let sortedWinningNumbers = winningNumbers.sort((a,b) => {
                    if(a.wins > b.wins){
                        return -1
                    }
                })
                
                var pickedNumbers = [];
                for(let i = 0; i < res.data.length; i++){
                    var result = res.data[i].result.split("-");
                    var find = false
                    for(let x = 0; x < result.length; x++){
                        if(pickedNumbers.length){
                            for(let y = 0; y < pickedNumbers.length; y++){
                                if(pickedNumbers[y].number == result[x]){
                                    find = true;
                                    pickedNumbers[y].picked++
                                    break
                                }
                            }
                            if(find == false){
                                pickedNumbers.push({
                                    number : result[x],
                                    picked : 1,
                                })
                            } else {
                                find = false
                            }
                        } else {
                            pickedNumbers.push({
                                number : result[x],
                                picked : 1,
                            })
                        }
                    }
                }

                
                let sortedPickedNumbers = pickedNumbers.sort((a,b) => {
                    if(a.picked > b.picked){
                        return -1
                    }
                })

                setPosibleWinningNumber(() => {
                    let output = "";
                    for(let i = 0; i < 6; i++){
                        if(i == 0){
                            output += sortedWinningNumbers[i].number
                        } else {
                            output += "-"+sortedWinningNumbers[i].number
                        }
                    }
                    return output;
                })

                setPosiblePickedNumber(() => {
                    let output = "";
                    for(let i = 0; i < 6; i++){
                        if(i == 0){
                            output += sortedPickedNumbers[i].number
                        } else {
                            output += "-"+sortedPickedNumbers[i].number
                        }
                    }
                    return output;
                })
                
                let sortedApiData = res.data.sort((a,b) => {
                    if(a.date > b.date){
                        return -1
                    }
                })

                let sortedNumbers = [];

                if(sortedPickedNumbers.length > 6){
                    for(let i = 0; i < sortedPickedNumbers.length; i++){
                        if(sortedNumbers.length){
                            for(let x = 0; x < sortedNumbers.length; x++){
                                if(sortedPickedNumbers[i].picked == sortedNumbers[x].picked){
                                    sortedNumbers[x].numbers.push(sortedPickedNumbers[i].number)
                                    break
                                } else {
                                    sortedNumbers.push({
                                        picked : sortedPickedNumbers[i].picked,
                                        numbers : [sortedPickedNumbers[i].number]
                                    })
                                }
                            }
                        } else {
                            sortedNumbers.push({
                                picked : sortedPickedNumbers[i].picked,
                                numbers : [sortedPickedNumbers[i].number]
                            })
                        }
                    }
                }

                // let picked = [];

                // for(let i = 0; i < sortedPickedNumbers.length; i++){
                //     if(picked.length){
                //         if(!picked.includes(sortedPickedNumbers[i].picked)){
                //             picked.push(sortedPickedNumbers[i].picked)
                //         }
                //     } else {
                //         picked.push(sortedPickedNumbers[i].picked)
                //     }
                // }

                // let sorted = []
                // for(let i = 0; i < picked.length; i++){
                //     for(let x = 0; x < sortedPickedNumbers.length; x++){
                //         if(picked[i] == sortedPickedNumbers[x].picked){
                //             if(sorted){
                //                 for(let y = 0; y < sorted.length; y++){
                //                     if(sorted[y].picked == picked[i]){
                //                         sorted[y].numbers.push(sortedPickedNumbers[x].number)
                //                         break
                //                     }
                //                 }
                //             } else {
                //                 sorted.push({
                //                     picked : picked[i],
                //                     numbers : [sortedPickedNumbers[x].number]
                //                 })
                //             }
                //         }
                //     }
                // }

                // console.log(sorted)
                // return

                let recurse = (sorted, length) => {
                    if(sortedPickedNumbers.length == length - 1){
                        return sorted
                    }

                    if(sorted.length > 0){
                        for(let x = 0; x < sorted.length; x++){
                            //console.log(sorted[x].picked)
                            let find = false
                            if(sortedPickedNumbers[length].picked === sorted[x].picked){
                                find = true
                            } 
                            
                            if(find){
                                sorted[x].numbers.push(sortedPickedNumbers[length].number)
                                find = false
                                return recurse(sorted, length + 1)
                            } else {
                                sorted.push({
                                    picked : sortedPickedNumbers[length].picked,
                                    numbers : [sortedPickedNumbers[length].number]
                                })
                            }
                        }
                    } else {
                        sorted.push({
                            picked : sortedPickedNumbers[length].picked,
                            numbers : [sortedPickedNumbers[length].number]
                        })
                        return recurse(sorted, length + 1)
                    }
                    
                }

                setApiData(sortedApiData)
                setWinningNumberData(sortedWinningNumbers)
                setPickedNumberData(sortedPickedNumbers)
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
            fetch(`http://${host + port}/barbies/api/lottery/delete/${idToDelete}`, requestOptions)
                .then(res => { handleClose(); console.log(`Succesfully deleted lottery result : ${idToDelete}`)})
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
                <td>{data.result}</td>
                <td>{data.winners}</td>
                <td>
                    <div className="d-grid gap-2">
                        <Button type='submit' variant='danger' className="btn btn-sm btn-block" onClick={()=>{handleShow(); setIdToDelete(data._id)}}>Delete</Button>
                    </div>
                </td>
            </tr>
        )
    }
    //render Winning Number Stats table data
    const winningNumberStats = (data, index) => {
        return (
            <tr key={index}>
                <td>{data.number}</td>
                <td>{data.wins}</td>
            </tr>
        )
    }
    //render Picked Number Stats table data
    const pickedNumberStats = (data, index) => {
        return (
            <tr key={index}>
                <td>{data.number}</td>
                <td>{data.picked}</td>
            </tr>
        )
    }
    return(
        <Stack gap={2} className="col-md-6 mx-auto">
            <h1>Lottery Results</h1>
            <span>
                <strong>Posible Winning Number :</strong> {posiblePickedNumber}
            </span>
            <div className='col-md-3'><Button className='btn btn-success btn-sm' href='/lottery/add'>Add</Button></div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Result</th>
                        <th>Winners</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {apiData.map(renderData)}
                </tbody>
            </Table>
            <h1>Picked Number Stats</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Total Picking</th>
                    </tr>
                </thead>  
                <tbody>
                    {pickedNumberData.map(pickedNumberStats)}
                </tbody>
            </Table>
            <h1>Winning Number Stats</h1>
            <span>
                <strong>Posible Winning Number :</strong> {posibleWinningNumber}
            </span>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Total Wins</th>
                    </tr>
                </thead>
                <tbody>
                    {winningNumberData.map(winningNumberStats)}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Live</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this lottery result?</Modal.Body>
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