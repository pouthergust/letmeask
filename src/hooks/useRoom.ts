import { useEffect, useState } from "react";

import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from "./useAuth";


type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswer: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswer: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => {
                        return like.authorId === user?.id
                    })?.[0]
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    }, [roomId, user?.id])

    return {questions, title}
}