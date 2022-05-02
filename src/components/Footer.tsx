import React from "react"
import CodeViewer from "./CodeViewer"

function Footer() {
  return (
    <div className="mt-4 bg-gray-100 dark:border-gray-700">
      <footer className="bg-white p-4 shadow dark:bg-gray-800 md:flex md:items-center md:justify-between md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2022{" "}
          <a href="https://flowbite.com" className="hover:underline">
            Virtual Lab
          </a>
          . All Rights Reserved.
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </footer>
      <CodeViewer code={"print('helo')"} lang="python" />
    </div>
  )
}

export default Footer
