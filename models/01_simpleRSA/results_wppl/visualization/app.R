library(shiny)
library(tidyverse)
library(here)

df = read_csv("data/data.csv",col_names = FALSE) %>% 
  rename(condition=X1,
         target=X2,
         colcomp=X3,
         contrast=X4,
         utterance=X5,
         prob=X6) %>% 
  # create utterance categories: target utterance noun, target utterance adj+noun, colcomp utterance noun, colcomp adj+noun, others
  separate(target,c("target_color","target_type")) %>% 
  separate(colcomp,c("colcomp_color","colcomp_type")) %>% 
  mutate(utt_cat = case_when(
    utterance == target_type ~ "target -- noun",
    utterance == colcomp_type ~ "colcomp -- noun",
    utterance == target_color ~ "target & comp -- adj",
    utterance == str_c(target_color, target_type, sep=" ") ~ "target -- adj+noun",
    utterance == str_c(colcomp_color, colcomp_type, sep=" ") ~ "colcomp -- adj+noun",
    TRUE ~ "others"
  )) %>%
  group_by(condition,utt_cat) %>%
  summarise(sum_prob=sum(prob)) %>% 
  ungroup() %>% 
  # change order of factor levels in ref_cat
  mutate_at(vars(utt_cat),
            funs(fct_relevel(utt_cat,"target -- noun","target -- adj+noun","target & comp -- adj","colcomp -- noun","colcomp -- adj+noun")))

# Define UI for app that draws a histogram ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Hello Shiny!"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: Selector for choosing dataset ----
      selectInput(inputId = "condition1",
                  label = "Choose the condition:",
                  choices = c("ttp", "ttn", "tap", "tan", "atp", "atn", "aap", "aan")),
      selectInput(inputId = "condition2",
                  label = "Choose the condition:",
                  choices = c("ttp", "ttn", "tap", "tan", "atp", "atn", "aap", "aan"))
      
    ),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Histogram ----
      plotOutput(outputId = "distPlot")
      
    )
  )
)

# Define server logic required to draw a histogram ----
server <- function(input, output) {
  
  filtered_df = reactive ({
    df %>% 
      filter((condition==input$condition1) | (condition==input$condition2)) %>% 
      # group_by(condition) %>% 
      mutate(bin_cond=group_indices(.,condition)) %>% 
      mutate_at(vars(bin_cond),funs(as.character(.)))
  })
  
  # Geom_col
  # is wrapped in a call to renderPlot to indicate that:
  #
  # 1. It is "reactive" and therefore should be automatically
  #    re-executed when inputs (filtered_df()) change
  # 2. Its output type is a plot
  output$distPlot <- renderPlot({
    
    ggplot(filtered_df(), aes(x=utt_cat,y=sum_prob,fill=bin_cond)) +
      geom_col(width=.8, position="dodge") +
      theme(axis.text.x = element_text(angle = 45, hjust = 1, size = 15)) +
      ylim(0,0.7)
    
  })
  
}

# Create Shiny app ----
shinyApp(ui = ui, server = server)