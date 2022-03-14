import { useEffect, useState } from 'react';
import './App.css';
import Note from './components/Note';

import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect');
    axios
      .get('http://localhost:3001/notes')
      .then(res => {
        console.log('promise fulfilled');
        setNotes(res.data)
      })
  }, [])
  console.log('render ', notes.length,' notes');

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random()>0.5,
      id: notes.length + 1
    }

    axios.post('http://localhost:3001/notes', noteObject)
         .then(response => {
          setNotes(notes.concat(response.data))
          setNewNote('')
         })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`);
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important:!note.important}
    axios.patch(url,changedNote)
          .then(response => {
            setNotes(notes.map(note => note.id!=id ? note : response.data))
          })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={()=> setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />  
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type='submit'>
          save
        </button>
      </form>
    </div>
  )
}

export default App
