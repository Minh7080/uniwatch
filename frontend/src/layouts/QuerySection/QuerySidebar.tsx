import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { subreddits } from './subreddits';
import { classificationLabels } from './classificationLabels';
import { emotions } from './emotions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import SidebarGroupCollapsible from './components/SidebarGroupCollapsible';
import DatePicker from '../../components/DatePicker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import SidebarItemCollapsible from './components/SidebarItemCollapsible';
import SearchButton from './components/SearchButton';
import PresetSelect from './components/PresetSelect';
import getDatePreset, { type setDatePresetInput } from './getDatePreset';
import MinMaxInput from './components/MinMaxInput';
import SliderInput from './components/SliderInput';
import { SelectItem } from '@/components/ui/select';
import DisalableInput from './components/DisalableInput';
import { ButtonGroup } from '@/components/ui/button-group';
import { type Sentiment, sentimentOptions } from './sentimentOptions';
import { Input } from '@/components/ui/input';
import SidebarSeparator from './components/SidebarSeparator';

export default function QuerySidebar() {
  const [sourcesChecked, setSourcesChecked] = useState<Map<string, boolean>>(
    () => new Map(subreddits.map(sub => [sub.subreddit, true]))
  );

  const [topics, setTopics] = useState<Map<string, boolean>>(
    () => new Map(classificationLabels.map(label => [label.key, false]))
  );

  const [emotionsSelected, setEmotionsSelected] = useState<Map<string, boolean>>(
    () => new Map(emotions.map(emotion => [emotion.key, false]))
  );

  const [sentiment, setSentiment] = useState<Sentiment>({
    positive: false,
    neutral: false,
    negative: false
  });

  const [openSections, setOpenSections] = useState({
    dateRanges: true,
    content: true,
    affect: false,
    engagement: false,
    toxicity: false,
  });

  const [enableSections, setEnableSection] = useState({
    upvotes: false,
    comments: false,
    upvoteRatio: false,
    topic: false,
    searchTerm: false,
    emotions: false,
    sentiment: false,
    irony: false,
    hateSpeech: false,
    offensive: false,
  });

  const [dateRanges, setDateRanges] = useState<{ from?: Date, to?: Date }>({
    from: undefined,
    to: undefined,
  });

  const [dateSelect, setDateSelect] = useState<setDatePresetInput>('all');
  const [upvoteRatio, setUpvoteRatio] = useState<number>(0.5);
  const [ironySelect, setIronySelect] = useState<boolean>(false);
  const [hateSpeechSelect, setHateSpeechSelect] = useState<boolean>(false);
  const [offensiveSelect, setOffensiveSelect] = useState<boolean>(false);

  return (
    <Sidebar contained>
      <SidebarHeader className='relative'>
        <SidebarTrigger className='absolute md:hidden' />
        <h3 className='text-center font-bold'>
          Query Posts
        </h3>
      </SidebarHeader>

      <SidebarContent className='gap-0'>
        <SidebarGroupCollapsible groupLabel='Sources'>
          {Array.from(sourcesChecked.values()).every(x => x === false) && (
            <SidebarMenuItem>
              <Alert variant='destructive' className='my-2'>
                <AlertCircleIcon />
                <AlertTitle>
                  At least one source must be selected
                </AlertTitle>
              </Alert>
            </SidebarMenuItem>
          )}
          {subreddits.map((subreddit, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton
                onClick={() => setSourcesChecked(prev => {
                  const copy = new Map(prev);
                  copy.set(subreddit.subreddit, !prev.get(subreddit.subreddit));
                  return copy;
                })}>
                <Label
                  className='flex items-start gap-3'
                >
                </Label>
                <Checkbox
                  checked={sourcesChecked.get(subreddit.subreddit)}
                />
                {`r/${subreddit.subreddit}`}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroupCollapsible>

        <SidebarSeparator />

        <SidebarGroupCollapsible groupLabel='Filters' defaultOpen>
          <SidebarItemCollapsible
            label='Date ranges'
            open={openSections.dateRanges}
            onClick={() => setOpenSections(prev => ({ ...prev, dateRanges: !prev.dateRanges }))}
          >
            {dateRanges.to && dateRanges.from && dateRanges.to < dateRanges.from && (
              <SidebarMenuSubItem>
                <Alert variant='destructive' className='my-2'>
                  <AlertCircleIcon />
                  <AlertTitle>
                    Invalid date range
                  </AlertTitle>
                  <AlertDescription>
                    <p>The 'To' date cannot be earlier than the 'From' date.</p>
                  </AlertDescription>
                </Alert>
              </SidebarMenuSubItem>
            )}

            <SidebarMenuSubItem className='ml-2 flex justify-end'>
              <PresetSelect
                label='Date ranges'
                value={dateSelect}
                onValueChange={(value) => {
                  setDateSelect(value as setDatePresetInput);
                  setDateRanges(getDatePreset(value as setDatePresetInput));
                }}
              >
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='week'>This week</SelectItem>
                <SelectItem value='month'>This month</SelectItem>
                <SelectItem value='year'>This year</SelectItem>
                <SelectItem value='all'>All time</SelectItem>
                <SelectItem value='custom'>Custom</SelectItem>
              </PresetSelect>
            </SidebarMenuSubItem>

            {dateSelect === 'custom' && (
              <SidebarMenuSubItem className='ml-2 flex pt-4'>
                <DatePicker
                  label='From'
                  date={dateRanges.from}
                  onSelect={date => setDateRanges(prev => ({ ...prev, from: date }))}
                />
                <DatePicker
                  label='To'
                  date={dateRanges.to}
                  onSelect={date => setDateRanges(prev => ({ ...prev, to: date }))}
                />
              </SidebarMenuSubItem>
            )}
          </SidebarItemCollapsible>


          <SidebarItemCollapsible
            label='Content'
            open={openSections.content}
            onClick={() => setOpenSections(prev => ({
              ...prev, content: !prev.content
            }))}
            className='flex flex-col gap-4'
          >

            <DisalableInput
              label='Topic'
              className='flex flex-wrap gap-2 justify-center'
              checked={enableSections.topic}
              onClick={() => setEnableSection(prev => ({
                ...prev, topic: !enableSections.topic
              }))}
            >
              {classificationLabels.map((label, idx) => {
                const Icon = label.icon;
                return (
                  <Button key={idx}
                    variant={topics.get(label.key) ? 'default' : 'outline'}
                    size='sm'
                    className='px-1.5! py-0.5! border! cursor-pointer'
                    onClick={() => setTopics(prev => {
                      const copy = new Map(prev);
                      copy.set(label.key, !prev.get(label.key));
                      return copy;
                    })}
                  >
                    <Icon />
                    {label.name}
                  </Button>
                );
              })}
            </DisalableInput>

            <DisalableInput
              label='Search term'
              className='flex flex-wrap gap-2 justify-center'
              checked={enableSections.searchTerm}
              onClick={() => setEnableSection(prev => ({
                ...prev, searchTerm: !enableSections.searchTerm
              }))}
            >
              <Input placeholder='Search Term' />
            </DisalableInput>

          </SidebarItemCollapsible>

          <SidebarItemCollapsible
            label='Affect'
            open={openSections.affect}
            onClick={() => setOpenSections(prev => ({
              ...prev, affect: !prev.affect
            }))}
            className='flex flex-col gap-4'
          >
            <DisalableInput
              label='Emotion'
              className='flex flex-wrap gap-2 justify-center'
              checked={enableSections.emotions}
              onClick={() => setEnableSection(prev => ({
                ...prev, emotions: !enableSections.emotions
              }))}
            >
              {emotions.map((emotion, idx) => {
                const Icon = emotion.icon;
                return (
                  <Button key={idx}
                    variant={emotionsSelected.get(emotion.key) ? 'default' : 'outline'}
                    size='sm'
                    className='px-1.5! py-0.5! border! cursor-pointer'
                    onClick={() => setEmotionsSelected(prev => {
                      const copy = new Map(prev);
                      copy.set(emotion.key, !prev.get(emotion.key));
                      return copy;
                    })}
                  >
                    <Icon />
                    {emotion.name}
                  </Button>
                );
              })}
            </DisalableInput>

            <DisalableInput
              label='Sentiment'
              checked={enableSections.sentiment}
              className='flex justify-center'
              onClick={() => setEnableSection(prev => ({
                ...prev, sentiment: !enableSections.sentiment
              }))}
            >
              <ButtonGroup className='pl-6'>
                {sentimentOptions.map((element, idx) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={idx}
                      variant={sentiment[element.value] ? 'default' : 'outline'}
                      disabled={!enableSections.sentiment}
                      size='sm'
                      className='px-1.5! py-0.5! border! cursor-pointer'
                      onClick={() => setSentiment(prev => ({
                        ...prev,
                        [element.value]: !prev[element.value]
                      }))}
                    >
                      <Icon />
                      {element.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </DisalableInput>

            <DisalableInput
              label='Irony'
              checked={enableSections.irony}
              className='flex justify-center'
              onClick={() => setEnableSection(prev => ({
                ...prev, irony: !enableSections.irony
              }))}
            >
              <PresetSelect
                label='Irony'
                value={ironySelect ? 'true' : 'false'}
                onValueChange={value => {
                  setIronySelect(value === 'true');
                }}
              >
                <SelectItem value='true'>True</SelectItem>
                <SelectItem value='false'>False</SelectItem>
              </PresetSelect>
            </DisalableInput>

          </SidebarItemCollapsible>

          <SidebarItemCollapsible
            label='Engagement'
            open={openSections.engagement}
            onClick={() => setOpenSections(prev => ({
              ...prev, engagement: !prev.engagement
            }))}
            className='flex flex-col gap-4'
          >
            <MinMaxInput
              label='Number of Upvotes'
              checked={enableSections.upvotes}
              onClick={() => setEnableSection(prev => ({
                ...prev, upvotes: !enableSections.upvotes
              }))}
            />

            <MinMaxInput
              label='Number of Comments'
              checked={enableSections.comments}
              onClick={() => setEnableSection(prev => ({
                ...prev, comments: !enableSections.comments
              }))}
            />

            <SliderInput
              label='Upvote Ratio'
              checked={enableSections.upvoteRatio}
              onClick={() => setEnableSection(prev => ({
                ...prev, upvoteRatio: !enableSections.upvoteRatio
              }))}
              value={upvoteRatio}
              setValue={setUpvoteRatio}
            />

          </SidebarItemCollapsible>

          <SidebarItemCollapsible
            label='Toxicity'
            open={openSections.toxicity}
            onClick={() => setOpenSections(prev => ({
              ...prev, toxicity: !prev.toxicity
            }))}
            className='flex flex-col gap-4'
          >
            <DisalableInput
              label='Hate Speech'
              checked={enableSections.hateSpeech}
              className='flex justify-center'
              onClick={() => setEnableSection(prev => ({
                ...prev, hateSpeech: !enableSections.hateSpeech
              }))}
            >
              <PresetSelect
                label='Irony'
                value={hateSpeechSelect ? 'true' : 'false'}
                onValueChange={value => {
                  setHateSpeechSelect(value === 'true');
                }}
              >
                <SelectItem value='true'>True</SelectItem>
                <SelectItem value='false'>False</SelectItem>
              </PresetSelect>
            </DisalableInput>

            <DisalableInput
              label='Offensive'
              checked={enableSections.offensive}
              className='flex justify-center'
              onClick={() => setEnableSection(prev => ({
                ...prev, offensive: !enableSections.offensive
              }))}
            >
              <PresetSelect
                label='Irony'
                value={offensiveSelect ? 'true' : 'false'}
                onValueChange={value => {
                  setOffensiveSelect(value === 'true');
                }}
              >
                <SelectItem value='true'>True</SelectItem>
                <SelectItem value='false'>False</SelectItem>
              </PresetSelect>
            </DisalableInput>

          </SidebarItemCollapsible>
        </SidebarGroupCollapsible>

        <SidebarSeparator />

        <SidebarGroupCollapsible groupLabel='Sorts' defaultOpen>
        </SidebarGroupCollapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className='flex justify-between gap-4'>
          <Button variant='outline' className='hover:text-red-400 w-20'>Reset</Button>
          <SearchButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
