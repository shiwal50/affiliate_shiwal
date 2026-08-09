document.addEventListener("DOMContentLoaded", function () {
  // ---------- Modal open/close ----------
  var modal = document.getElementById("lead-modal");
  if (modal) {
    var openTriggers = document.querySelectorAll("[data-open-modal]");
    var closeTriggers = modal.querySelectorAll("[data-close-modal]");

    openTriggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        var firstInput = modal.querySelector("input");
        if (firstInput) firstInput.focus();
      });
    });

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    closeTriggers.forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  // ---------- Form submission (handles both modal and inline forms) ----------
  var forms = document.querySelectorAll(".lead-form");

  forms.forEach(function (form) {
    var status = form.querySelector("[data-status]");
    var accessKeyField = form.querySelector('input[name="access_key"]');
    var accessKey = accessKeyField ? accessKeyField.value : "";

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        status.textContent = "Form isn't fully set up yet: the site owner needs to add a real Web3Forms access key.";
        status.className = "form-status error";
        return;
      }

      var submitBtn = form.querySelector("button[type=submit]");
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      status.textContent = "";
      status.className = "form-status";

      var messageField = form.querySelector('input[name="message"]');
      if (messageField) {
        var nameVal = form.querySelector('[name="name"]').value;
        var emailVal = form.querySelector('[name="email"]').value;
        var agencyIdVal = form.querySelector('[name="agency_id"]') ? form.querySelector('[name="agency_id"]').value : "";
        var agencyEmailVal = form.querySelector('[name="agency_email"]') ? form.querySelector('[name="agency_email"]').value : "";
        messageField.value =
          "Name: " + nameVal + "\n" +
          "Email: " + emailVal + "\n" +
          "Agency ID: " + (agencyIdVal || "-") + "\n" +
          "Agency Email: " + (agencyEmailVal || "-");
      }

      var formData = new FormData(form);
      var payload = Object.fromEntries(formData.entries());

      try {
        var res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        var result = await res.json();

        if (res.ok && result.success) {
          status.textContent = "Thanks, I'll be in touch shortly.";
          status.className = "form-status success";
          form.reset();
        } else {
          status.textContent = (result && result.message) ? result.message : "Something went wrong. Please try again or email affiliateshiwal@gmail.com directly.";
          status.className = "form-status error";
        }
      } catch (err) {
        status.textContent = "Couldn't reach the form service. Please try again or email affiliateshiwal@gmail.com directly.";
        status.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
});
