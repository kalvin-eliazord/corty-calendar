# Corty Calendar Documentation

## Overview

Corty Calendar is a React application that replicates Google Calendar functionalities, including task management, multiple calendar views (day, week, month, year), with on top of that dynamic filtering/sorting of tasks. The project is built using Create React App and leverages React Router for navigation, Context API for state management, and various custom hooks for enhanced code reuse and performance.

## Table of Contents

1. [Project Setup and Installation](#project-setup-and-installation)
2. [Architecture Overview](#architecture-overview)
3. [Component Structure](#component-structure)
    - [App Component & Routing](#app-component--routing)
    - [Navbar Components](#navbar-components)
    - [Calendar Components](#calendar-components)
    - [Task Modals](#task-modals)
    - [Tasks List & Sorting/Filtering](#tasks-list--sortingfiltering)
4. [State Management & Contexts](#state-management--contexts)

## Project Setup and Installation

1. Clone the repository from your GitHub account.
2. Navigate to the project directory:  

   ```bash
   cd corty-calendar
   
3. Install dependencies using npm or yarn:  

   ```bash
   npm install
    # or
   yarn install
   
4. Run it using npm or yarn:  

   ```bash
   npm start
    # or
   yarn start 

## Architecture Overview

The Corty Calendar is built using the following technologies:
- React for building the user interface.
- React Router for navigating between views.
- Context API to share state across components, managing tasks, calendar dates, and modals.
- Custom Hooks for reusable state logic, such as form management.
- Styled Components for consistent and maintainable styling.

## Component Structure

### App Component & Routing

The App component serves as the main entry point. It sets up the router and global contexts (such as Tasks, Calendar, and Modals) and defines routes for various views:
- Calendar Views (Day, Week, Month, Year)
- Tasks Page (for managing tasks)
- Modal Management (for conditionally rendering modals to add or view tasks)

### Navbar Components

The navigation is provided by two main components:
- **TopNavbar:** Displays the current date, navigation arrows for changing dates, and a view selector (day/week/month/year). It also provides links to switch to the tasks view.
- **LeftNavbar:** Contains an "Add Task" button and an embedded mini calendar (MonthCalendar) for quick navigation.

### Calendar Components

The calendar section comprises:
- **MonthCalendar & MonthBody:** These render the month view, manage month-to-month navigation, and handle day selection.
- **Other Views:** Additional views (DayView, WeekView, and YearView) offer alternative representations of the calendar, each linked through routing.

### Task Modals

The application offers two primary modals for task management:
- **AddTaskModal:** A form for creating or editing tasks. It includes fields for task title, description, due date, time (with validation and formatting), priority, complexity, and options for recurring tasks.
- **ViewTaskModal:** Displays detailed task information, including progress (using a progress bar for subtasks) and interactive buttons to edit, delete, or toggle the task's completion status.
- **YearViewTasksModal:** Displays months in a year, and display a modal with the tasks scheduled for a specific day in the year view with deleting task possibility.

### Tasks List & Sorting/Filtering

The Tasks component handles several key functionalities:
- **Dynamic Filtering:** Users can filter tasks based on search terms (by task title) and selected labels.
- **Sorting:** Tasks can be sorted by criteria such as due date, priority, or complexity. The sorting logic is encapsulated in a generic sorting function.
- **Infinite Scrolling:** Tasks are loaded incrementally as the user scrolls through the list.
- **Power Mode:** A specialized mode that sorts tasks based on a combination of complexity and priority, highlighting the most challenging tasks.

## State Management & Contexts

The application uses React Context to manage and share state across components:
- **TasksContext:** Manages the list of tasks and operations (adding, removing, updating, toggling completion).
- **CalendarContext:** Maintains the current calendar view state (date, month, year, etc.) and provides navigation functions.
- **ModalsContext:** Controls the visibility of modals (AddTaskModal and ViewTaskModal).
- **TaskSelectedIdContext & DateSelectedContext:** Provide information about the currently selected task and date.