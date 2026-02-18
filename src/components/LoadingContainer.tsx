import { useLoadingStore } from "@/context/useLoadingStore"
import Loading from "./Loading"


const LoadingContainer = () => {
    const isLoading = useLoadingStore(state => state.isLoading);

    return <Loading visible={isLoading} />
}


export default LoadingContainer