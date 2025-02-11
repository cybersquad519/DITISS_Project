document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")
  
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        button.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    document.getElementById("calculate-file-hash").addEventListener("click", calculateFileHash)
    document.getElementById("calculate-text-hash").addEventListener("click", calculateTextHash)
    document.getElementById("compare-hash").addEventListener("click", compareHashes)
  })
  
  async function calculateFileHash() {
    const fileInput = document.getElementById("file-input")
    const algorithm = document.getElementById("file-algorithm").value
    const resultDiv = document.getElementById("file-hash-result")
  
    if (fileInput.files.length === 0) {
      resultDiv.textContent = "Please select a file."
      return
    }
  
    const file = fileInput.files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("algorithm", algorithm)
  
    try {
      const response = await fetch("/calculate_file_hash", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      resultDiv.textContent = `${algorithm.toUpperCase()}: ${result.hash}`
    } catch (error) {
      resultDiv.textContent = "Error calculating hash."
    }
  }
  
  async function calculateTextHash() {
    const textInput = document.getElementById("text-input").value
    const algorithm = document.getElementById("text-algorithm").value
    const resultDiv = document.getElementById("text-hash-result")
  
    if (!textInput) {
      resultDiv.textContent = "Please enter some text."
      return
    }
  
    try {
      const response = await fetch("/calculate_text_hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput, algorithm: algorithm }),
      })
      const result = await response.json()
      resultDiv.textContent = `${algorithm.toUpperCase()}: ${result.hash}`
    } catch (error) {
      resultDiv.textContent = "Error calculating hash."
    }
  }
  
  function compareHashes() {
    const hash1 = document.getElementById("hash1").value
    const hash2 = document.getElementById("hash2").value
    const resultDiv = document.getElementById("compare-result")
  
    if (!hash1 || !hash2) {
      resultDiv.textContent = "Please enter both hash values."
      return
    }
  
    if (hash1.toLowerCase() === hash2.toLowerCase()) {
      resultDiv.textContent = "The hash values match."
    } else {
      resultDiv.textContent = "The hash values do not match."
    }
  }
  
  