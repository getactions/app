package core

type Secret struct {
	Description string `yaml:"description"`
}

type meta struct {
	Id          string            `yaml:"id"`
	Name        string            `yaml:"name"`
	Description string            `yaml:"description"`
	Secrets     map[string]Secret `yaml:"secrets"`
}

type Workflow struct {
	Meta     meta
	Contents string
}
