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

## VTButton

VTButton is a thin wrapper around the Material-UI Button.
It removes the need to alter the color or variant, so that we can use consistent buttons accross the website.

Props:

- neutral: boolean, neutral colored button
- accept: boolean
- danger: boolean
- secondary: boolean

## Dialogs

Thin wrappers for Material dialogs.
So far we have `OkDialog` and `ConfirmDialog`.

Props:

- title: string
- disabled: boolean
- onConfirm/onOk: function
- onClose: function
- okText: string
- open
