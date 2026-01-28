function generateLetter() {
  const representative = document.getElementById("representative").value;
  const event = document.getElementById("event").value || "Hack With Mumbai 2.0";
  const venue = document.getElementById("venue").value || "Bharati Vidyapeeth (Deemed to be University), Kharghar, Navi Mumbai";
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;

  // Add smooth animation to the letter
  const letterElement = document.getElementById("letter");
  letterElement.style.opacity = '0';
  letterElement.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    // Set current date in DD-MM-YYYY format
    const today = new Date();
    const dateStr = ("0" + today.getDate()).slice(-2) + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + today.getFullYear();
    document.getElementById("date").innerText = dateStr;

    // Set student representative in signature line
    document.getElementById("representativeSign").innerText = representative;

    // Set event details
    document.getElementById("eventName").innerText = event;
    document.getElementById("eventVenue").innerText = venue;

    // Format dates
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const fromDay = fromDate.getDate();
      const toDay = toDate.getDate();
      const fromMonth = monthNames[fromDate.getMonth()];
      const toMonth = monthNames[toDate.getMonth()];
      const year = fromDate.getFullYear();

      document.getElementById("eventDates").innerText = `${fromDay}th and ${toDay}th ${toMonth} ${year}`;
    }

    calculateTotal();
    
    // Fade in animation
    letterElement.style.transition = 'all 0.5s ease';
    letterElement.style.opacity = '1';
    letterElement.style.transform = 'translateY(0)';
  }, 100);
}

function calculateRow(input) {
  const row = input.closest("tr");
  const cells = row.querySelectorAll("input[type='number']");
  
  if (cells.length >= 2) {
    const cost = parseFloat(cells[0].value) || 0;
    const qty = parseFloat(cells[1].value) || 0;
    const amount = cost * qty;
    
    row.querySelector(".amount").innerText = amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace('.', '=');
  }
  
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll(".amount").forEach(cell => {
    const text = cell.innerText.replace('=', '.');
    total += parseFloat(text) || 0;
  });
  
  document.getElementById("grandTotal").innerText = total.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace('.', '=').replace(/,/g, ',');
}

function downloadPDF() {
  const element = document.getElementById("letter");
  const clonedElement = element.cloneNode(true);

  // Remove any animations and transforms
  clonedElement.style.opacity = '1';
  clonedElement.style.transform = 'none';
  clonedElement.style.animation = 'none';

  // Ensure all styles are applied
  clonedElement.style.width = '210mm';
  clonedElement.style.height = '297mm';
  clonedElement.style.padding = '12mm 15mm 12mm 15mm';
  clonedElement.style.boxSizing = 'border-box';

  // Create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '210mm';
  tempContainer.style.height = '297mm';
  tempContainer.appendChild(clonedElement);
  document.body.appendChild(tempContainer);

  const opt = {
    margin: [0, 0, 0, 0], // No margins since padding is set on element
    filename: 'TA_DA_Request_Letter.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    }
  };

  html2pdf()
    .set(opt)
    .from(clonedElement)
    .save()
    .then(() => {
      // Remove temporary container
      document.body.removeChild(tempContainer);
    })
    .catch((error) => {
      console.error('PDF generation error:', error);
      // Remove temporary container on error
      document.body.removeChild(tempContainer);
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  generateLetter();
  
  // Add smooth hover effects to inputs
  const inputs = document.querySelectorAll('.controls input, .controls select');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });
});
