package main

import (
	"flag"
	"fmt"
	"openformation/actions/core"
	"os"

	"github.com/fatih/color"
)

func handleError(error error) {
	if error != nil {
		output := color.New(color.FgRed)

		output.Println()
		output.Println(fmt.Sprintf("\n ❌ An error occurred while installing the workflow: %s \n", error.Error()))

		os.Exit(1)
	}
}

func main() {
	id := flag.String("id", "", "The ID of the workflow you want to install.")

	flag.Parse()

	if *id == "" {
		flag.PrintDefaults()

		os.Exit(1)
	}

	output := color.New(color.FgHiCyan)
	output.Println(fmt.Sprintf("\n 🚀 Installing workflow '%s' ...", *id))

	contents, error := core.FetchWorkflowFileContents(id)

	handleError(error)

	workflow, error := core.ParseWorkflowFile(contents)

	handleError(error)

	error = core.InstallWorkflow(workflow)

	handleError(error)

	output.Add(color.FgGreen).Println("\n ✅ Workflow installed successfully! Have fun! 🎉")
	output.Println()

	if workflow.Meta.Secrets != nil {
		output.Add(color.FgRed).Println("\n Attention!")
		output.Add(color.Reset).Println("\n This workflow requires you to add the following secrets. Head over to your repository settings to add them:")
		output.Println()

		for key, secret := range workflow.Meta.Secrets {
			output.Add(color.FgYellow).Print(fmt.Sprintf("    %s: ", key))
			output.Add(color.Reset).Printf("%s\n", secret.Description)
		}

		output.Println()

		output.Add(color.ResetBlinking)
	}
}
