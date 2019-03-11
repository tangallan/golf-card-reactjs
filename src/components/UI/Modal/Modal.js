import React from 'react';

const modal = (props) => {
    return <div className='modal-mask'>
        <div className='modal'>
            <div className='modal-head'>
                <p className='modal-title'>{props.title}</p>
            </div>
            <div className='modal-body'>
                {props.children}
            </div>
            <div className='modal-footer'>
                {/* <button className='button-primary'>Save</button> */}
            </div>
        </div>
    </div>
};

export default modal;