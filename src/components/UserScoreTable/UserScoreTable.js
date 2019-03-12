import React from 'react';

const userScoreTable = (props) => {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th colSpan="2">{props.user}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Round</td>
                        <td>Score</td>
                    </tr>
                    {props.scores.map((s, idx) => (
                        <tr key={idx}>
                            <td>{s.round}</td>
                            <td>{s.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default userScoreTable;