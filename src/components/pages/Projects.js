import Message from "../layout/Message";
import { useLocation } from "react-router-dom";
import styles from "./Project.module.css";
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState("");

    const location = useLocation();
    let message = "";
    if (location.state) {
        message = location.state.message;
    }

    useEffect(() => {
        setTimeout(() => {
            fetch("http://localhost:5000/projects", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setProjects(data);
                    } else {
                        console.error("Dados recebidos não são um array:", data);
                        setProjects([]);
                    }
                    setRemoveLoading(true);
                })
                .catch((err) => {
                    console.error("Erro ao carregar projetos:", err);
                    setRemoveLoading(true); 
                });
        }, 3000);
    }, []);

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then(() => {
                setProjects((prevProjects) =>
                    prevProjects.filter((project) => project.id !== id)
                );
                setProjectMessage("Projeto removido com sucesso");
            })
            .catch((err) => console.error("Erro ao remover projeto:", err));
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            <div>
                {message && <Message type="success" msg={message} />}
                {projectMessage && <Message type="success" msg={projectMessage} />}

                <Container customClass="start">
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                                id={project.id}
                                name={project.name}
                                budget={project.budget}
                                category={project.category?.name || "Sem categoria"}
                                key={project.id}
                                handleRemove={removeProject}
                            />
                        ))
                    ) : (
                        !removeLoading && <Loading />
                    )}
                    {removeLoading && projects.length === 0 && (
                        <p>Não há projetos cadastrados</p>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default Projects;
