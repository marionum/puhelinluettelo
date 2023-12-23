import { useEffect, useState } from 'react'
import Filter from './components/filter.jsx'
import PersonForm from './components/personform.jsx'
import Persons from './components/person.jsx'
import personsServices from './services/people.js'
import { Notification } from './components/notifications.jsx'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notificationStatus, setNotificationStatus] = useState(null)
    const [lastModifiedPerson, setLastModifiedPerson] = useState('')

    useEffect(() => {
        personsServices
            .getAll()
            .then(response =>{
                setPersons(response.data)
            })
    }, [])

    useEffect(() => {
        personsServices
            .getAll()
            .then(response =>{
                setPersons(response.data)
            })
    }, [newName])

    useEffect(()=>{
        personsServices
            .getAll()
            .then(response=>{
                setPersons(response.data)
            })
    }, [newNumber])

    function containsObject(object, list){
        for (let i = 0; i < list.length; i++){
            if (JSON.stringify(object.name) === JSON.stringify(list[i].name)){
                return true;
            }
        }
        return false;
    }

    function findPersonIdByName(name, arr){
        return arr.find(x => x.name === `${name}`).id
    }

    const handleNewName = (event) =>{
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) =>{
        setNewNumber(event.target.value)
    }

    const handleFilter = (event) =>{
        setFilter(event.target.value)
    }

    const handleSetPersons = (event) =>{
        event.preventDefault()
        const updatedPersons = [...persons]
        if (!containsObject({name: newName, number: newNumber}, updatedPersons)){
            const newPerson = {name: newName, number: newNumber}
            updatedPersons.push(newPerson)
            setPersons(updatedPersons)
            personsServices
                .create(newPerson)
            setLastModifiedPerson(newPerson)
            setNotificationStatus('success')
            setTimeout(() => {
                setNotificationStatus(null)
            }, 5000);
        } else {
            if (window.confirm(`${newName} is already added to phonebook, replace the number with new one?`)){
                const personToUpdateId = findPersonIdByName(newPerson)
                personsServices
                    .update(personToUpdateId, {newPerson})
                setLastModifiedPerson(newPerson)
                setNotificationStatus('success')
                setTimeout(() => {
                    setNotificationStatus(null)
                }, 5000);
            }

        }
        setNewName('')
        setNewNumber('')
    }

    const handleDeletePersons = (name) =>{
        if (window.confirm(`Delete ${name}?`)) {
            const updatedPersons = [...persons]
            const personToDeleteId = findPersonIdByName(name, updatedPersons)
            setPersons(updatedPersons.filter(x => x.id !== personToDeleteId))
            personsServices
                .deletePerson(personToDeleteId)
                .catch(error =>{
                    console.log('error catched')
                    setLastModifiedPerson({name: name, number: null})
                    setNotificationStatus('alreadyDeleted')
                    setTimeout(()=>{
                        setNotificationStatus(null)
                    }, 5000)

                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification name={lastModifiedPerson.name} notificationStatus={notificationStatus}/>
            <Filter handleFilter={handleFilter}/>
            <h2>Add a new</h2>
            <PersonForm newName={newName} newNumber={newNumber}
                        handleNewName={handleNewName} handleNewNumber={handleNewNumber}
                        handleSetPersons={handleSetPersons}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} handler={handleDeletePersons}/>
        </div>
    )
}

export default App