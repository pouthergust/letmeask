import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswer: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswer: boolean;
}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth()
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
    const roomId = params.id;

    useEffect(() => {
        const roomRef = ref(getDatabase(), `rooms/${roomId}`);

        return onValue(roomRef, room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswer: value.isAnswer,
                    isHighlighted: value.isHighlighted,
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    }, [roomId])

    async function handleSendQueston(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('Você precisa estar logado')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswer: false,
        }

        const questionref = ref(getDatabase(), `rooms/${roomId}/questions`)
        const insertQuestion = push(questionref)
        await set(insertQuestion, question)

        setNewQuestion('');
    }

    return ( 
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>                

                <form onSubmit={handleSendQueston}>
                    <textarea 
                        placeholder="o que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                        />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                 <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para eviar uma pergunta, <button>faça seu login</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}