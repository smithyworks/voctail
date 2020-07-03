# Common Components

## The AppPage component

`import AppPage from "<relative>/common/AppPage";`

The AppPage component wraps every page on our website.

Props:

- id: a string, will be the id on the body container component.
- location: a string, informs the component which nav button is active
- title: a string, this sets the title of the HTML page.

## Toasts

`import AppPage, {toasts} from "<relative>/common/AppPage";`

```
// Success toast
toasts.toastSuccess(message);

// warning toast
toasts.toastWarning(message);

// Error toast
toasts.toastError(message);

// Info toast
toasts.toastInfo(message);
```
