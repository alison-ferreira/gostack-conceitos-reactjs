import React, {useState, useEffect} from "react";

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepository] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepository(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const repositoryName = document.getElementById("repositoryName").value;
    const gitURLTemplate = "https://github.com/alison-ferreira/{{REPO_NAME}}.git";
    const gitURL = encodeURI(
        gitURLTemplate
          .replace("{{REPO_NAME}}", repositoryName.replace(/\W/g, "-").toLowerCase())
      );

    const response = await api.post('repositories', {
      "title": repositoryName,
      "url": gitURL,
      "techs": ["JavaScript", "NodeJS"]
    })

    setRepository([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete('repositories/' + id);

    if (response.status === 204) {
      setRepository(repositories.filter(
        repository => repository.id !== id
      ));
    } else {
      console.log(response);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(
          repository => 
          <>
          <li key={repository.id}>{repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
          </li>
          </>
        )}
      </ul>

      <input type="text" id="repositoryName" />
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
