import { useAtomValue } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'

const ReplaceCourse = () => {
    const open = useAtomValue(atomModalReplaceCourse)
    return <>{open ? <div>YOYOYOYOYOYOYO</div> : null}</>
}

export default ReplaceCourse
