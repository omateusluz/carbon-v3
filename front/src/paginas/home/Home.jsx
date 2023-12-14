import '../../styles/Home.css';

export default function Entrar(){

  return (
    <div className="home">
      <div className="frame" id="logos">
        <img className="logo-icon" alt="" src="/logo.svg" />
        <h2 className="logo" id="logo-nome">
          CARBON
        </h2>
      </div>
      <a className="h1" href="/entrar">
        <p className="envie-receba">{`ENVIE & RECEBA`}</p>
        <p className="envie-receba">
          <span>DINHEIRO,</span>
          <span> SIMPLES</span>
        </p>
        <p className="transparente">
          <span>{`& TRANSPARENTE `}</span>
          <span className="span">{`->`}</span>
        </p>
      </a>
    </div>
  );
}