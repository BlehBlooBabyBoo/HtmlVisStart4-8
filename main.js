document.addEventListener('DOMContentLoaded', function () {
  const yearEls = document.querySelectorAll('#year, #year-2, #year-3, #year-4')
  const year = new Date().getFullYear()
  yearEls.forEach(e => { if (e) e.textContent = year })

  const navToggle = document.querySelector('.nav-toggle')
  const nav = document.querySelector('.nav')
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'))
  }

  const filters = document.querySelectorAll('.filter')
  const galleryItems = document.querySelectorAll('.gallery-grid figure')
  const searchInput = document.getElementById('search')

  const applyFilters = () => {
    const activeFilter = document.querySelector('.filter.active').getAttribute('data-filter')
    const query = searchInput ? searchInput.value.toLowerCase() : ''
    galleryItems.forEach(item => {
      const text = item.querySelector('figcaption').textContent.toLowerCase()
      const category = item.dataset.category
      const show = (activeFilter === 'all' || category === activeFilter) && (query === '' || text.includes(query))
      item.style.display = show ? 'block' : 'none'
    })
    updateVisibleItems()
  }

  if (filters.length && galleryItems.length) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const active = document.querySelector('.filter.active')
        if (active) active.classList.remove('active')
        btn.classList.add('active')
        applyFilters()
      })
    })
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters)
  }

  const lightbox = document.getElementById('lightbox')
  const lightboxImage = lightbox ? lightbox.querySelector('img') : null
  const closeButton = lightbox ? lightbox.querySelector('.close') : null
  const prevButton = lightbox ? lightbox.querySelector('.prev') : null
  const nextButton = lightbox ? lightbox.querySelector('.next') : null
  let currentIndex = 0
  let visibleItems = []

  const updateVisibleItems = () => {
    visibleItems = Array.from(document.querySelectorAll('.gallery-grid figure')).filter(item => item.style.display !== 'none')
  }

  const showImage = (index) => {
    if (visibleItems.length === 0) return
    currentIndex = (index + visibleItems.length) % visibleItems.length
    const img = visibleItems[currentIndex].querySelector('img')
    lightboxImage.src = img.src
    lightboxImage.alt = img.alt
  }

  document.querySelectorAll('.gallery-grid figure').forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return
      updateVisibleItems()
      currentIndex = visibleItems.indexOf(item)
      showImage(currentIndex)
      lightbox.style.display = 'flex'
      lightbox.setAttribute('aria-hidden', 'false')
    })
  })

  if (prevButton) {
    prevButton.addEventListener('click', () => showImage(currentIndex - 1))
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => showImage(currentIndex + 1))
  }

  if (closeButton && lightbox) {
    closeButton.addEventListener('click', () => {
      lightbox.style.display = 'none'
      lightbox.setAttribute('aria-hidden', 'true')
    })
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        lightbox.style.display = 'none'
        lightbox.setAttribute('aria-hidden', 'true')
      }
    })
  }

  // Keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (lightbox.style.display === 'flex') {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1)
      else if (event.key === 'ArrowRight') showImage(currentIndex + 1)
      else if (event.key === 'Escape') {
        lightbox.style.display = 'none'
        lightbox.setAttribute('aria-hidden', 'true')
      }
    }
  })

  const header = document.querySelector('.site-header')
  const hero = document.querySelector('.hero')
  const heroBg = hero ? hero.querySelector('.hero-bg') : null
  const checkHeader = () => {
    if (!header) return
    if (window.scrollY > 20) header.classList.add('scrolled')
    else header.classList.remove('scrolled')
  }
  const checkHeroFade = () => {
    if (!hero) return
    const scrollY = window.scrollY
    if (scrollY > 100) hero.classList.add('faded')
    else hero.classList.remove('faded')
    if (heroBg) {
      heroBg.style.transform = `scale(${1 + Math.min(scrollY / 2500, 0.045)})`
    }
  }
  checkHeader()
  checkHeroFade()
  window.addEventListener('scroll', checkHeader)
  window.addEventListener('scroll', checkHeroFade)

  const reveals = document.querySelectorAll('.reveal')
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          if (entry.target.classList.contains('fade-background')) {
            entry.target.classList.add('active')
          }
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    reveals.forEach(item => observer.observe(item))
  }
})