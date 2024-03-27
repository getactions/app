package core

import (
	"fmt"
	"io"
	"net/http"
)

func FetchWorkflowFileContents(id *string) (*string, error) {
	response, error := http.Get("https://gist.githubusercontent.com/akoenig/c8173bfdb87f8809a9ab731bfed99a6f/raw/81cea0b7f6621ced4c34a49a7e679a07c5a7ceed/test.yaml")
	// response, error := http.Get("https://api.github.com/repos/openformation/actions/contents/workflows/" + *id + ".yml")

	if error != nil {
		return nil, error
	}

	if response.StatusCode == 404 {
		return nil, fmt.Errorf("the given workflow doesn't exist")
	}

	defer response.Body.Close()

	body, error := io.ReadAll(response.Body)

	if error != nil {
		return nil, fmt.Errorf("reading the response from GitHub failed")
	}

	contents := string(body)

	return &contents, nil
}
