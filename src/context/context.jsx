import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [items, setItems] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [total, setTotal] = useState(0);
    const [splitCompleted, setSplitCompleted] = useState(false);

    return (
        <AppContext value={{members, setMembers, items, setItems, total, setTotal, assignments, setAssignments, splitCompleted, setSplitCompleted}}>
            {children}
        </AppContext>
    )
}