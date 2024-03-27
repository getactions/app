package core

import (
	"errors"
	"fmt"
	"os"
	"path"
)

func InstallWorkflow(workflow *Workflow) error {
	cwd, error := os.Getwd()

	if error != nil {
		return fmt.Errorf("failed to get the current working directory")
	}

	pathOfWorkflowFiles := path.Join(cwd, ".github", "workflows")
	pathOfWorkflowFile := path.Join(pathOfWorkflowFiles, fmt.Sprintf("%s.yaml", workflow.Meta.Id))

	{
		_, error := os.Stat(pathOfWorkflowFile)

		if errors.Is(error, os.ErrExist) {
			return fmt.Errorf("the workflow already exists")
		} else if !errors.Is(error, os.ErrNotExist) {
			return fmt.Errorf("checking if the workflow already exists failed")
		}
	}

	{
		error := os.MkdirAll(pathOfWorkflowFiles, os.ModePerm)

		if error != nil {
			return fmt.Errorf("creating the directory for the workflow files failed")
		}

	}

	{
		error := os.WriteFile(pathOfWorkflowFile, []byte(workflow.Contents), os.ModePerm)

		if error != nil {
			return fmt.Errorf("writing the workflow file failed")
		}

	}

	return nil
}
