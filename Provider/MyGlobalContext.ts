import { createContext, useContext } from "react"
export type GlobalContent = {
    workId: string;
    setWorkId: (v: string) => void;
    team: string;
    setTeam: (v: string) => void;
    group: string;
    setGroup: (v: string) => void;
}
export const MyGlobalContext = createContext<GlobalContent>({
    workId: '',
    setWorkId: () => { },
    team: '',
    setTeam: () => { },
    group: '',
    setGroup: () => { }
})
export const useGlobalContext = () => useContext(MyGlobalContext)