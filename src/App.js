import { useEffect, useState } from 'react';
import './App.css';
import Note from './components/Note';
import Notification from './components/Notification';
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrormessage] = useState('some error happened...')

  useEffect(() => {
    console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
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

    noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
         })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important:!note.important}
    
    noteService
          .update(id,changedNote)
          .then(returnedNote => {
            setNotes(notes.map(note => note.id!=id ? note : returnedNote))
          })
          .catch(error => {
            setErrormessage(
              `Note ${note.content} was already removed from server`
            )
            setTimeout(() => {
              setErrormessage(null)
            }, 5000)
            setNotes(notes.filter(n => n.id !== id))
          })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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
