# Install The Socket in C:\\reefer
1. Clone or download the updated ReeferDude repository.
2. Open PowerShell in the repository root.
3. Run: powershell -ExecutionPolicy Bypass -File .\\tools\\install-socket-to-reefer.ps1 -ProjectRoot C:\\reefer
4. Start the Vite app using your existing scripts and open /socket/.
The installer copies only the static app into public\\socket. The React component source is at src\\features\\GravityGoneNebula.tsx and requires the existing framer-motion dependency. The static route is usable without changing the current router.
