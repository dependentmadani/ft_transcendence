import error from '../../assets/error.jpeg'
import './Error.css'

export function NotFound() {
    return (
        <>
            <h1>404 Not Found</h1>
            <div>
                <h3>Fin Ghadi, Fin Awa Ghadi</h3>
                <img id='error-image' src={error} />
            </div>
        </>
    );
}