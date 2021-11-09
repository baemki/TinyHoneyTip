export default function Alert({ isOk, okHandler, message }) {
    return (
        <>
            {isOk ? (
                <div className="alert">
                    <div className="back">
                        <div className="container">
                            <div className="box">{message}</div>
                            <div>
                                <button className="btn" onClick={okHandler}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
