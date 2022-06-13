import Image from "next/image";

export default function Profile({ profile, type }) {
  if (!profile || !profile.data) {
    return <div style={{padding: "10px"}}>No {type} profile found.</div>;
  }
  return (
    <div className="container">
      <h2>{type} profile</h2>
      <div className="img-container">
        <img
          src={profile.data.img.replace("ipfs://", "https://images.gamma.io/ipfs/")}
          width="200"
          className="header-img"
        />
      </div>

      <main>
        <div className="grid">
          <h1 className="title">{profile.data.name}</h1>
          <p className="header-card">{profile.data.description}</p>
        </div>
        <div className="grid">
          {profile.data.links &&
            profile.data.links?.map((l) => {
              return (
                <a key={l.id} href={l.url} className="card">
                  <h3>{l.title} &rarr;</h3>
                </a>
              );
            })}
        </div>
        <div>
          <small>{profile.nameOwner}</small>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          width: 80%;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #bebebe;
          border-radius: 5%;
        }

        main {
          padding: 5rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #eeeeee;
          border-radius: 5%;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .address {
          line-height: 1.5;
          font-size: 1rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .img-container {
          width: 200px;
          height: 200px;
          border-radius:5%
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .header-img {
          margin-top:20px;
          position:relative;
          top: 0;
          left: 50% - 100px;
          border-radius:5%;
        }

        .header-card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .header-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .header-card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
