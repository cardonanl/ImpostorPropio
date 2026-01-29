# 🕵️ El Impostor (Win95 Edition)

Un juego estilo *“Impostor”* con estética retro tipo Windows 95, pensado para jugar en grupo pasando el teléfono.

Motivación principal: Los que han subido aplicaciones a la AppStore están cobrando como si esto diera plata.

👉 Versión online:  
https://impostor.nicolascardona.com/

---

## 🎮 ¿Cómo funciona?

1. El anfitrión ingresa los nombres de los jugadores.
2. Selecciona una categoría.
3. Define el número de impostores y el tiempo.
4. Cada jugador revela su rol en privado.
5. El grupo debate y elimina sospechosos.
6. Gana el equipo correcto… o los impostores.

---

## ✨ Características

- 🖥️ Interfaz estilo Windows 95
- 🔐 Revelado privado por turnos
- 🕵️ Mensaje especial para impostores
- 💾 Conserva jugadores entre partidas
- 📱 Responsive (móvil / desktop)
- 🚀 Deploy automático con Vercel

---

## 🛠️ Stack Técnico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **UI:** CSS custom (Win95 style)
- **Estado:** LocalStorage
- **Deploy:** Vercel
- **Control de versiones:** Git + GitHub

---

## 🚀 Desarrollo Local

### Requisitos

- Node.js >= 20

### Instalación

```bash
git clone https://github.com/cardonanl/ImpostorPropio.git
cd ImpostorPropio
npm install

src/
 ├── app/
 │   ├── page.tsx       # Home / Configuración
 │   ├── reveal/        # Revelado por turnos
 │   └── play/          # Eliminaciones
 ├── lib/
 │   ├── game.ts        # Lógica del juego
 │   └── storage.ts     # Persistencia local
public/
 └── icons/             # Iconos Win95

