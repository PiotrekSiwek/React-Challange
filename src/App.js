import React, {useEffect, useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Container, FormControl, ListGroup, ListGroupItem, Navbar} from "react-bootstrap"
let listData;

function App() {

    const [list, setList] = useState([])

    useEffect(() => {
        fetch("https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json")
            .then(data => data.json())
            .then(data => {
                function compare(a, b) {
                    const surnameA = a.last_name.toUpperCase();
                    const surnameB = b.last_name.toUpperCase();
                    let comparison = 0;
                    if (surnameA > surnameB) {
                        comparison = 1;
                    } else if (surnameA < surnameB) {
                        comparison = -1;
                    }
                    return comparison;
                }
                const sorted = data.sort(compare);
                listData = sorted.map(elm => {
                    return {...elm, checkbox: false}
                })
                setList(listData)
            })
    }, [])

    const handleChange = e => {
        let index = listData.findIndex(({id}) => id === Number(e.target.id))
        listData[index].checkbox = !listData[index].checkbox;
        setList([...listData]);
        listData.filter(({checkbox}) => checkbox === true).forEach(({id}) => console.log(id))
    }

    const handleInput = (e) => {
        const filter = listData.filter(elm => elm.first_name.toLowerCase().includes(e.target.value.toLowerCase())? elm :elm.last_name.toLowerCase().includes(e.target.value.toLowerCase())? elm :null )
        setList([...filter])
    }

    const renderList = list.map(({id,avatar, checkbox, first_name, last_name}) => {
        return <ListGroupItem id={id} key={id}>
            <label htmlFor={id}>
                <img src={avatar} alt=""/>
                <span style={{margin:"0 10px"}}>{`${first_name}  ${last_name}`}</span>
            </label>
            <input id={id} type="checkbox" value={checkbox} onChange={handleChange}/>
        </ListGroupItem>
    })

    return (
        <>
            <Container>
            <Navbar bg="dark" style={{color:"white"}}>Contacts</Navbar>
            <FormControl type="text" onChange={handleInput} placeholder="search contact...."/>
                <ListGroup>
                    {renderList}
                </ListGroup>
                {!list.length&& <div>Loading...</div>}
            </Container>
        </>
    );
}

export default App;
