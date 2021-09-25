import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { getDatabase, ref, set, push } from "firebase/database";

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss'

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();

    const [newRoom, setNewRoom] = useState('');
    const database = getDatabase();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = ref(database, 'rooms' ); 
        const newRoomref = push(roomRef)
        await set(newRoomref, {
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${newRoomref.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala" 
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                            />
                        <Button type="submit"> 
                            Criar sala
                        </Button>
                    </form>
                    <p>
                    Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p> 
                </div>
            </main>
        </div>
    );
}