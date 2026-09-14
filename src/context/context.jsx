import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [items, setItems] = useState([]);
    const [assignments, setAssignments] = useState({});
    
    return (
        <AppContext value={{members, setMembers, items, setItems, assignments, setAssignments}}>
            {children}
        </AppContext>
    )   
}