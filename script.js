;(function () {
  'use strict'

  const NOTE_MAX_LENGTH = 150

  // ---------- Referencias ----------
  const garden = document.getElementById('garden')
  const cards = Array.from(document.querySelectorAll('.card'))
  const confirmBar = document.getElementById('confirm')
  const confirmEmoji = document.getElementById('confirmEmoji')
  const confirmTitle = document.getElementById('confirmTitle')
  const confirmButton = document.getElementById('confirmButton')

  const chooserSection = document.getElementById('chooserSection')
  const letterSection = document.getElementById('letter')
  const petalsLayer = document.getElementById('petals')

  const modalOverlay = document.getElementById('modalOverlay')
  const modalEmoji = document.getElementById('modalEmoji')
  const modalPlanTitle = document.getElementById('modalPlanTitle')
  const modalCancel = document.getElementById('modalCancel')
  const modalConfirm = document.getElementById('modalConfirm')
  const modalError = document.getElementById('modalError')

  const planDateInput = document.getElementById('planDate')
  const planTimeInput = document.getElementById('planTime')
  const planNoteInput = document.getElementById('planNote')
  const charCounter = document.getElementById('charCounter')

  let selectedCard = null
  let isSubmitting = false
  let lastFocusedBeforeModal = null

  // ---------- Jardín SVG generado por JS ----------
  function buildGarden() {
    if (!garden) return
    const NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('viewBox', '0 0 1000 1000')
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice')

    function sprig(x, y, scale, flip) {
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('class', 'sprig')
      g.setAttribute('transform', `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`)

      const stem = document.createElementNS(NS, 'path')
      stem.setAttribute('d', 'M0,0 C -4,-30 6,-55 -2,-90')
      g.appendChild(stem)

      const leafPaths = [
        'M0,-25 C -18,-30 -22,-45 -8,-52 C -2,-42 0,-33 0,-25 Z',
        'M-2,-55 C 16,-58 22,-72 10,-80 C 2,-72 -2,-63 -2,-55 Z',
      ]
      leafPaths.forEach((d) => {
        const leaf = document.createElementNS(NS, 'path')
        leaf.setAttribute('d', d)
        leaf.setAttribute('fill', 'rgba(138,154,126,0.35)')
        leaf.setAttribute('stroke', 'none')
        g.appendChild(leaf)
      })

      const bloom = document.createElementNS(NS, 'circle')
      bloom.setAttribute('cx', -2)
      bloom.setAttribute('cy', -90)
      bloom.setAttribute('r', 5.5)
      bloom.setAttribute('class', Math.random() > 0.5 ? 'bloom' : 'bloom-alt')
      g.appendChild(bloom)

      for (let i = 0; i < 5; i++) {
        const petal = document.createElementNS(NS, 'ellipse')
        const angle = (i / 5) * Math.PI * 2
        const cx = -2 + Math.cos(angle) * 9
        const cy = -90 + Math.sin(angle) * 9
        petal.setAttribute('cx', cx)
        petal.setAttribute('cy', cy)
        petal.setAttribute('rx', 6)
        petal.setAttribute('ry', 3.5)
        petal.setAttribute('transform', `rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`)
        petal.setAttribute('fill', 'none')
        petal.setAttribute('stroke', 'rgba(216,167,160,0.55)')
        petal.setAttribute('stroke-width', '1')
        g.appendChild(petal)
      }

      return g
    }

    const placements = [
      [40, 1000, 1.1, false],
      [110, 1005, 0.8, true],
      [180, 998, 1.4, false],
      [860, 1000, 1.2, true],
      [930, 1005, 0.9, false],
      [960, 995, 1.5, true],
      [500, 1010, 0.7, false],
      [30, 990, 0.6, true],
      [970, 990, 0.65, false],
    ]
    placements.forEach((p) => svg.appendChild(sprig(...p)))
    garden.appendChild(svg)
  }

  function getTodayISODate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // ---------- Selección de tarjetas ----------
  function selectCard(card) {
    if (isSubmitting) return
    const isNewPlan = selectedCard !== card

    cards.forEach((c) => {
      c.classList.remove('selected')
      c.setAttribute('aria-pressed', 'false')
    })
    card.classList.add('selected')
    card.setAttribute('aria-pressed', 'true')
    selectedCard = card

    confirmEmoji.textContent = card.dataset.emoji
    confirmTitle.textContent = card.dataset.title
    confirmBar.classList.add('show')

    if (isNewPlan) resetModalFields()

    confirmBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function bindCardEvents() {
    cards.forEach((card) => {
      card.addEventListener('click', () => selectCard(card))
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          selectCard(card)
        }
      })
    })
  }

  // ---------- Campos del modal ----------
  function resetModalFields() {
    planDateInput.value = ''
    planTimeInput.value = ''
    planNoteInput.value = ''
    updateCharCounter()
    clearFieldErrors()
  }

  function updateCharCounter() {
    charCounter.textContent = `${planNoteInput.value.length}/${NOTE_MAX_LENGTH}`
  }

  function clearFieldErrors() {
    planDateInput.classList.remove('field-error')
    planTimeInput.classList.remove('field-error')
  }

  function bindFieldEvents() {
    planNoteInput.addEventListener('input', updateCharCounter)
    planDateInput.addEventListener('input', () => planDateInput.classList.remove('field-error'))
    planTimeInput.addEventListener('input', () => planTimeInput.classList.remove('field-error'))
  }

  // ---------- Modal ----------
  function openModal() {
    if (!selectedCard) return
    modalEmoji.textContent = selectedCard.dataset.emoji
    modalPlanTitle.textContent = selectedCard.dataset.title
    modalError.hidden = true
    clearFieldErrors()
    planDateInput.min = getTodayISODate()
    lastFocusedBeforeModal = document.activeElement

    modalOverlay.hidden = false
    requestAnimationFrame(() => modalOverlay.classList.add('show'))
    modalConfirm.focus()

    document.addEventListener('keydown', onModalKeydown)
  }

  function closeModal() {
    modalOverlay.classList.remove('show')
    document.removeEventListener('keydown', onModalKeydown)
    setTimeout(() => {
      modalOverlay.hidden = true
      if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus()
      }
    }, 300)
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape' && !isSubmitting) closeModal()
  }

  function setSubmitting(state) {
    isSubmitting = state
    modalConfirm.disabled = state
    modalCancel.disabled = state

    const label = modalConfirm.querySelector('.btn-label')
    const spinner = modalConfirm.querySelector('.spinner')
    if (label) label.hidden = state
    if (spinner) spinner.hidden = !state

    confirmButton.disabled = state
  }

  function showModalError(message) {
    modalError.textContent = message
    modalError.hidden = false
  }

  // ---------- Validación ----------
  function validatePlanDetails(dateValue, timeValue) {
    if (!selectedCard) {
      showModalError('Selecciona primero un plan.')
      return false
    }

    let hasError = false

    if (!dateValue) {
      planDateInput.classList.add('field-error')
      hasError = true
    }
    if (!timeValue) {
      planTimeInput.classList.add('field-error')
      hasError = true
    }

    if (hasError) {
      showModalError('Por favor selecciona la fecha y la hora antes de confirmar.')
      return false
    }

    if (dateValue < getTodayISODate()) {
      planDateInput.classList.add('field-error')
      showModalError('Por favor elige una fecha a partir de hoy.')
      return false
    }

    return true
  }

  // ---------- Envío a la API ----------
  async function sendConfirmation() {
    if (!selectedCard || isSubmitting) return

    const dateValue = planDateInput.value
    const timeValue = planTimeInput.value
    const noteValue = planNoteInput.value.trim().slice(0, NOTE_MAX_LENGTH)

    modalError.hidden = true
    if (!validatePlanDetails(dateValue, timeValue)) return

    setSubmitting(true)

    const payload = {
      emoji: selectedCard.dataset.emoji,
      title: selectedCard.dataset.title,
      description: selectedCard.dataset.desc,
      date: dateValue,
      time: timeValue,
      note: noteValue,
    }

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'No se pudo enviar la confirmación.')
      }

      // MODIFICACIÓN: Ya no guardamos en localStorage para permitir múltiples intentos
      closeModal()
      revealLetter()
    } catch (err) {
      showModalError('Algo salió mal enviando tu elección. Inténtalo de nuevo en un momento.')
      setSubmitting(false)
    }
  }

  // ---------- Pétalos ----------
  function spawnPetals() {
    if (!petalsLayer) return
    const emojis = ['🌸', '🌷', '🌹', '💮', '🤍']
    const count = 26

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span')
      petal.className = 'petal'
      petal.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      const left = Math.random() * 100
      const drift = (Math.random() - 0.5) * 160
      const duration = 6 + Math.random() * 5
      const delay = Math.random() * 3
      const size = 0.9 + Math.random() * 0.9

      petal.style.left = `${left}vw`
      petal.style.setProperty('--drift', `${drift}px`)
      petal.style.animationDuration = `${duration}s`
      petal.style.animationDelay = `${delay}s`
      petal.style.fontSize = `${size}rem`

      petalsLayer.appendChild(petal)
    }

    petalsLayer.classList.add('show')
  }

  // ---------- Revelar carta final ----------
  function revealLetter() {
    chooserSection.classList.add('fading-out')
    spawnPetals()

    setTimeout(() => {
      chooserSection.hidden = true
      chooserSection.setAttribute('hidden', '')
      letterSection.hidden = false
      letterSection.removeAttribute('hidden')
      letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // NUEVO: Habilitamos un botón oculto para que pueda volver a elegir sin recargar la página
      const restartBtn = document.getElementById('restartHint')
      if (restartBtn) {
        restartBtn.textContent = '🌸 Elegir otro plan'
        restartBtn.removeAttribute('disabled')
        restartBtn.addEventListener('click', resetUX)
      }
    }, 650)
  }

  // NUEVA FUNCIÓN: Permite regresar al catálogo de opciones de inmediato
  function resetUX() {
    isSubmitting = false
    setSubmitting(false)

    letterSection.setAttribute('hidden', '')
    letterSection.hidden = true

    if (petalsLayer) {
      petalsLayer.classList.remove('show')
      petalsLayer.innerHTML = ''
    }

    chooserSection.removeAttribute('hidden')
    chooserSection.hidden = false
    chooserSection.classList.remove('fading-out')

    if (selectedCard) {
      selectedCard.classList.remove('selected')
      selectedCard.setAttribute('aria-pressed', 'false')
      selectedCard = null
    }

    confirmBar.classList.remove('show')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Eventos globales ----------
  function bindGlobalEvents() {
    confirmButton.addEventListener('click', openModal)
    modalCancel.addEventListener('click', closeModal)
    modalConfirm.addEventListener('click', sendConfirmation)
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay && !isSubmitting) closeModal()
    })
  }

  function init() {
    buildGarden()
    bindCardEvents()
    bindFieldEvents()
    bindGlobalEvents()
    if (planDateInput) planDateInput.min = getTodayISODate()
    updateCharCounter()

    // MODIFICACIÓN: Ya no verificamos el localStorage al cargar la página.
    // Siempre mostrará el catálogo disponible.
  }

  document.addEventListener('DOMContentLoaded', init)
})()
