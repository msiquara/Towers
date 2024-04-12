import './Botoes.css';

function Botoes({choose4Grid, choose5Grid, choose5HardGrid,listaRodadas, restart, solve, disable_button}){
    return (
        <div className="botoes">
            <div className='botao__novo_jogo' onClick={listaRodadas}>
                {'New Game'}
                <div className='menu__conteudo'>
                    <button className="botao__criar" onClick={choose4Grid}>
                        4x4 - Easy 
                    </button>
                    <button className="botao__criar" onClick={choose5Grid}>
                        5x5 - Normal 
                    </button>
                    <button className="botao__criar" onClick={choose5HardGrid}>
                        5x5 - Hard 
                    </button>
                </div>
            </div>
            <div className="botoes__game">
                <button className="botoes__restart" onClick={restart} disabled={disable_button}>
                    Restart
                </button>
                <button className="botoes__solve" onClick={solve} disabled={disable_button}>
                    Solve
                </button>

            </div>
        </div>
    )
}

export default Botoes;