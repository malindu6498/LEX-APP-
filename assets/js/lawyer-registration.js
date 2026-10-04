document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lawyerApplicationForm');
    const status = document.getElementById('applicationStatus');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const application = Object.fromEntries(new FormData(form).entries());
        application.role = 'lawyer';
        application.submittedAt = new Date().toISOString();
        localStorage.setItem('lexLawyerApplication', JSON.stringify(application));

        form.hidden = true;
        status.hidden = false;
        status.textContent = 'Your demo application has been saved in this browser. It has not been sent to LEX for review.';
    });
});
