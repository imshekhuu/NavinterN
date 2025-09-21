// Loader simulation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display='none';
            mainContent.style.display='block';
        }, 1000);
    }, 1500);
});

// Internship Data
const internships = [
    { title: 'Data Science Intern @ Google', required_skills:['python','data analysis','statistics'], description:'Analyze data and build models.', capacity:3, location:'urban', sector:'AI', reserved_for:['general','sc','st','obc','pwd'], aspirational_district_quota:false, past_participation_allowed:true },
    { title: 'Web Developer Intern @ Microsoft', required_skills:['html','css','javascript'], description:'Build modern responsive web apps.', capacity:2, location:'urban', sector:'Web Development', reserved_for:['general','sc','st','obc','pwd'], aspirational_district_quota:false, past_participation_allowed:true },
    { title: 'AI Research Intern @ IBM', required_skills:['machine learning','python','deep learning'], description:'Research AI algorithms.', capacity:1, location:'urban', sector:'AI', reserved_for:['general','sc','st','obc','pwd'], aspirational_district_quota:false, past_participation_allowed:false },
    { title: 'Cybersecurity Intern @ Infosys', required_skills:['networking','security','python'], description:'Protect digital assets.', capacity:2, location:'rural', sector:'Cybersecurity', reserved_for:['sc','st','obc','pwd'], aspirational_district_quota:true, past_participation_allowed:true },
    { title: 'UX/UI Design Intern @ Adobe', required_skills:['design','figma','prototyping'], description:'Design intuitive interfaces.', capacity:2, location:'aspirational', sector:'Design', reserved_for:['general','sc','st','obc','pwd'], aspirational_district_quota:true, past_participation_allowed:true }
];

const internshipCapacityUsed = { 'Data Science Intern @ Google':0,'Web Developer Intern @ Microsoft':0,'AI Research Intern @ IBM':0,'Cybersecurity Intern @ Infosys':0,'UX/UI Design Intern @ Adobe':0 };

function capitalize(str){return str.charAt(0).toUpperCase()+str.slice(1);}

// Match internships
function matchInternships(){
    const skillsInput = document.getElementById('skillsInput').value.trim().toLowerCase();
    const qualification = document.getElementById('qualificationInput').value;
    const locationPref = document.getElementById('locationInput').value;
    const sectorInput = document.getElementById('sectorInput').value.trim().toLowerCase();
    const socialCategory = document.getElementById('socialCategoryInput').value;
    const pastParticipation = document.getElementById('pastParticipationInput').value;

    if(!skillsInput||!qualification||!locationPref||!sectorInput||!socialCategory||!pastParticipation){alert('Please fill all fields.');return;}

    const candidateSkills = skillsInput.split(',').map(s=>s.trim());
    const candidateSectors = sectorInput.split(',').map(s=>s.trim());

    const matches = internships.map(internship=>{
        if(internshipCapacityUsed[internship.title]>=internship.capacity)return null;
        const locationMatch = locationPref==='any'||locationPref===internship.location;
        if(!locationMatch)return null;
        const sectorOverlap = candidateSectors.some(s=>s.toLowerCase()===internship.sector.toLowerCase());
        if(!sectorOverlap)return null;
        if(!internship.reserved_for.includes(socialCategory))return null;
        if(internship.aspirational_district_quota && !(locationPref==='aspirational'||locationPref==='rural')) return null;
        if(!internship.past_participation_allowed && pastParticipation==='yes') return null;
        const qualificationLevels = {diploma:1,bachelor:2,master:3,phd:4,other:0};
        if(qualificationLevels[qualification]<2) return null;
        const skillMatches = internship.required_skills.filter(skill=>candidateSkills.includes(skill.toLowerCase()));
        const skillScore = skillMatches.length/internship.required_skills.length;
        return {...internship, skillScore, skillMatches, capacityLeft: internship.capacity-internshipCapacityUsed[internship.title]};
    }).filter(m=>m!==null);

    matches.sort((a,b)=>b.skillScore-a.skillScore);
    displayResults(matches);
}

// Display results
function displayResults(matches){
    const resultsSection = document.getElementById('resultsSection');
    const results = document.getElementById('results');
    results.innerHTML='';
    if(matches.length===0){
        results.innerHTML='<p class="text-gray-500">No suitable internships found.</p>';
        resultsSection.style.display='block';
        return;
    }
    matches.forEach(match=>{
        const percentMatch = Math.round(match.skillScore*100);
        const div = document.createElement('div');
        div.className='bg-glass p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1';
        div.innerHTML=`
            <h4 class="text-indigo-900 font-bold text-lg mb-1">${match.title}</h4>
            <p class="text-gray-700 mb-1">${match.description}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Required Skills:</strong> ${match.required_skills.join(', ')}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Your Matching Skills:</strong> ${match.skillMatches.join(', ')||'None'}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Location:</strong> ${capitalize(match.location)}</p>
            <p class="text-sm text-gray-600 mb-2"><strong>Sector:</strong> ${match.sector}</p>
            <div class="w-full bg-gray-300 h-3 rounded-full">
                <div class="bg-indigo-700 h-3 rounded-full transition-all duration-1000" style="width:${percentMatch}%"></div>
            </div>
            <p class="text-sm text-gray-700 mt-1 font-semibold">${percentMatch}% Match</p>
        `;
        results.appendChild(div);
    });
    resultsSection.style.display='block';
}

// Dark mode toggle
document.getElementById('themeToggle').addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode');
});
