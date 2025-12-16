// Function to fetch the JSON data and display the projects
async function fetchAndDisplayProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = ''; // Clear the "Loading" message

  try {
    // 1. Fetch the data from the local JSON file
    const response = await fetch('projects.json');

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. Parse the JSON data
    const projects = await response.json();

    // 3. Loop through each project and create the HTML structure
    projects.forEach(project => {
      // Create the main project div
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-card';

      // Create and set the content for each field
      projectDiv.innerHTML = `
        <div class="flex-container text-container container-border">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-type"><strong>Type:</strong> ${project.type}</p>
        <p class="project-technologies"><strong>Tech:</strong> ${project.technologies.join(', ')}</p>
        <a href="${project.link}" class="cta-button">View Project</a>
        </div>
      `;

      // 4. Append the new project div to the container
      container.appendChild(projectDiv);
    });

  } catch (error) {
    // Handle any errors during fetching or processing
    console.error('Error fetching or processing projects:', error);
    container.innerHTML = '<p class="error">Could not load projects. Please check the projects.json file path and format.</p>';
  }
}

// Execute the function when the script loads
fetchAndDisplayProjects();
